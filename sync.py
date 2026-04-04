#!/usr/bin/env python3
"""
Todoist <-> Notion Two-Way Sync
Runs every 5 minutes via GitHub Actions.
"""

import json
import os
import sys
import time
from datetime import datetime, timezone

import requests

# ─── Credentials (from environment / GitHub Secrets) ──────────────────────────

TODOIST_TOKEN = os.environ.get("TODOIST_API_TOKEN", "")
NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")

if not TODOIST_TOKEN or not NOTION_TOKEN:
    print("ERROR: TODOIST_API_TOKEN and NOTION_TOKEN must be set.")
    sys.exit(1)

TODOIST_BASE = "https://api.todoist.com/api/v1"
NOTION_BASE = "https://api.notion.com/v1"

NOTION_HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}
TODOIST_HEADERS = {"Authorization": f"Bearer {TODOIST_TOKEN}"}

STATE_FILE = "state.json"
CONFIG_FILE = "config.json"

# Priority mappings
T2N_PRIORITY = {4: "P1", 3: "P2", 2: "P3", 1: "P4"}
N2T_PRIORITY = {"P1": 4, "P2": 3, "P3": 2, "P4": 1}


# ─── State & Config ───────────────────────────────────────────────────────────

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"last_sync": None, "task_map": {}}


def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def load_config():
    with open(CONFIG_FILE) as f:
        return json.load(f)


def save_config(config):
    with open(CONFIG_FILE, "w") as f:
        json.dump(config, f, indent=2)


# ─── Todoist API ──────────────────────────────────────────────────────────────

def todoist_get(path, params=None):
    r = requests.get(f"{TODOIST_BASE}{path}", headers=TODOIST_HEADERS, params=params)
    r.raise_for_status()
    data = r.json()
    return data.get("results", data) if isinstance(data, dict) and "results" in data else data


def todoist_post(path, payload):
    r = requests.post(f"{TODOIST_BASE}{path}", headers=TODOIST_HEADERS, json=payload)
    r.raise_for_status()
    if r.content:
        return r.json()
    return {}


def get_todoist_projects():
    return todoist_get("/projects")


def get_todoist_tasks():
    return todoist_get("/tasks")


def create_todoist_task(content, project_id, priority=1, due_date=None, description=""):
    payload = {
        "content": content,
        "project_id": project_id,
        "priority": priority,
    }
    if due_date:
        payload["due_date"] = due_date
    if description:
        payload["description"] = description
    return todoist_post("/tasks", payload)


def update_todoist_task(task_id, content=None, priority=None, due_date=None, description=None):
    payload = {}
    if content is not None:
        payload["content"] = content
    if priority is not None:
        payload["priority"] = priority
    if due_date is not None:
        payload["due_date"] = due_date
    if description is not None:
        payload["description"] = description
    if not payload:
        return {}
    r = requests.post(
        f"{TODOIST_BASE}/tasks/{task_id}",
        headers=TODOIST_HEADERS,
        json=payload,
    )
    r.raise_for_status()
    return r.json() if r.content else {}


def close_todoist_task(task_id):
    r = requests.post(
        f"{TODOIST_BASE}/tasks/{task_id}/close",
        headers=TODOIST_HEADERS,
    )
    return r.status_code in (200, 204)


def reopen_todoist_task(task_id):
    r = requests.post(
        f"{TODOIST_BASE}/tasks/{task_id}/reopen",
        headers=TODOIST_HEADERS,
    )
    return r.status_code in (200, 204)


# ─── Notion API ───────────────────────────────────────────────────────────────

def notion_get(path):
    r = requests.get(f"{NOTION_BASE}{path}", headers=NOTION_HEADERS)
    r.raise_for_status()
    return r.json()


def notion_post(path, payload):
    r = requests.post(f"{NOTION_BASE}{path}", headers=NOTION_HEADERS, json=payload)
    r.raise_for_status()
    return r.json()


def notion_patch(path, payload):
    r = requests.patch(f"{NOTION_BASE}{path}", headers=NOTION_HEADERS, json=payload)
    r.raise_for_status()
    return r.json()


def query_notion_db(db_id, filter_body=None):
    payload = {"page_size": 100}
    if filter_body:
        payload["filter"] = filter_body
    results = []
    while True:
        r = requests.post(
            f"{NOTION_BASE}/databases/{db_id}/query",
            headers=NOTION_HEADERS,
            json=payload,
        )
        r.raise_for_status()
        data = r.json()
        results.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        payload["start_cursor"] = data["next_cursor"]
    return results


def get_notion_prop(page, name, kind):
    prop = page.get("properties", {}).get(name, {})
    if kind == "title":
        items = prop.get("title", [])
        return items[0].get("plain_text", "") if items else ""
    elif kind == "select":
        sel = prop.get("select")
        return sel.get("name", "") if sel else ""
    elif kind == "rich_text":
        items = prop.get("rich_text", [])
        return items[0].get("plain_text", "") if items else ""
    elif kind == "date":
        d = prop.get("date")
        return d.get("start", "") if d else ""
    return ""


def build_notion_props(content, priority=None, due_date=None, description=None,
                       todoist_id=None, status=None, project=None, source=None):
    props = {
        "Task Name": {"title": [{"text": {"content": content}}]},
    }
    if status:
        props["Status"] = {"select": {"name": status}}
    if priority:
        props["Priority"] = {"select": {"name": priority}}
    if due_date:
        props["Due Date"] = {"date": {"start": due_date}}
    if description:
        props["Description"] = {"rich_text": [{"text": {"content": description[:2000]}}]}
    if todoist_id:
        props["Todoist ID"] = {"rich_text": [{"text": {"content": str(todoist_id)}}]}
    if project:
        props["Project"] = {"rich_text": [{"text": {"content": project}}]}
    if source:
        props["Source"] = {"select": {"name": source}}
    return props


def create_notion_page(db_id, **kwargs):
    props = build_notion_props(**kwargs)
    return notion_post("/pages", {"parent": {"database_id": db_id}, "properties": props})


def update_notion_page(page_id, **kwargs):
    props = build_notion_props(**kwargs)
    return notion_patch(f"/pages/{page_id}", {"properties": props})


def archive_notion_page(page_id):
    notion_patch(f"/pages/{page_id}", {"archived": True})


# ─── Auto-create Notion DB for new Todoist project ───────────────────────────

EMOJIS = {
    "default": "📋",
    "grocery": "🛒", "family": "👨‍👩‍👧", "blogging": "✍️",
    "ai": "🤖", "office": "🏢", "talent": "🌟",
}


def get_emoji(name):
    n = name.lower()
    for key, emoji in EMOJIS.items():
        if key in n:
            return emoji
    return EMOJIS["default"]


DB_SCHEMA = {
    "Task Name": {"title": {}},
    "Status": {"select": {"options": [
        {"name": "To Do", "color": "gray"},
        {"name": "In Progress", "color": "blue"},
        {"name": "Done", "color": "green"},
    ]}},
    "Priority": {"select": {"options": [
        {"name": "P1", "color": "red"},
        {"name": "P2", "color": "orange"},
        {"name": "P3", "color": "yellow"},
        {"name": "P4", "color": "gray"},
    ]}},
    "Due Date": {"date": {}},
    "Description": {"rich_text": {}},
    "Todoist ID": {"rich_text": {}},
    "Source": {"select": {"options": [
        {"name": "Todoist", "color": "red"},
        {"name": "Notion", "color": "blue"},
    ]}},
    "Project": {"rich_text": {}},
}


def create_notion_db_for_project(project_name, parent_page_id):
    payload = {
        "parent": {"type": "page_id", "page_id": parent_page_id},
        "icon": {"type": "emoji", "emoji": get_emoji(project_name)},
        "title": [{"type": "text", "text": {"content": f"{project_name} Tasks"}}],
        "properties": DB_SCHEMA,
    }
    result = notion_post("/databases", payload)
    print(f"  Created Notion DB for new project: {project_name} -> {result['id']}")
    return result["id"]


# ─── Project resolution ───────────────────────────────────────────────────────

def find_notion_db(todoist_project_id, todoist_project_name, config):
    # Direct lookup by Todoist project ID
    mapped_name = config["todoist_project_map"].get(todoist_project_id)
    if mapped_name:
        db_id = config["project_map"].get(mapped_name)
        if db_id:
            return db_id, mapped_name

    # Fuzzy match on project name
    name_lower = todoist_project_name.lower()
    for notion_name, db_id in config["project_map"].items():
        if notion_name.lower() in name_lower or name_lower in notion_name.lower():
            return db_id, notion_name

    return None, None


# ─── Main sync ────────────────────────────────────────────────────────────────

def sync():
    config = load_config()
    state = load_state()
    task_map = state.get("task_map", {})  # {todoist_id: notion_page_id}
    skip_projects = set(config["sync_settings"].get("skip_projects", []))
    auto_create = config["sync_settings"].get("auto_create_notion_db_for_new_projects", True)

    print(f"Starting sync at {datetime.now(timezone.utc).isoformat()}")

    # ── Step 1: Get all Todoist projects & tasks ───────────────────────────────
    all_projects = get_todoist_projects()
    project_lookup = {p["id"]: p["name"] for p in all_projects}

    all_tasks = get_todoist_tasks()
    active_task_ids = {t["id"] for t in all_tasks}

    print(f"Todoist: {len(all_tasks)} active tasks across {len(all_projects)} projects")

    # ── Step 2: Handle new Todoist projects (auto-create Notion DB) ────────────
    if auto_create:
        for proj in all_projects:
            if proj["name"] in skip_projects:
                continue
            db_id, _ = find_notion_db(proj["id"], proj["name"], config)
            if not db_id:
                print(f"New Todoist project detected: {proj['name']}")
                new_db_id = create_notion_db_for_project(proj["name"], config["notion_parent_page_id"])
                config["project_map"][proj["name"]] = new_db_id
                config["todoist_project_map"][proj["id"]] = proj["name"]
                save_config(config)
                time.sleep(0.3)

    # ── Step 3: Todoist → Notion ───────────────────────────────────────────────
    print("\n--- Todoist → Notion ---")
    for task in all_tasks:
        proj_name = project_lookup.get(task["project_id"], "")
        if proj_name in skip_projects:
            continue

        db_id, mapped_name = find_notion_db(task["project_id"], proj_name, config)
        if not db_id:
            print(f"  Skipping task '{task['content']}' (project '{proj_name}' not mapped)")
            continue

        priority = T2N_PRIORITY.get(task.get("priority", 1), "P4")
        due_date = task.get("due", {}).get("date") if task.get("due") else None
        description = task.get("description", "")

        notion_page_id = task_map.get(task["id"])

        if notion_page_id:
            # Task already synced — update if changed
            try:
                update_notion_page(
                    notion_page_id,
                    content=task["content"],
                    priority=priority,
                    due_date=due_date,
                    description=description,
                    todoist_id=task["id"],
                    status="To Do",
                    project=mapped_name or proj_name,
                    source="Todoist",
                )
                print(f"  Updated: '{task['content']}'")
            except Exception as e:
                print(f"  Failed to update '{task['content']}': {e}")
        else:
            # New task — create in Notion
            try:
                page = create_notion_page(
                    db_id,
                    content=task["content"],
                    priority=priority,
                    due_date=due_date,
                    description=description,
                    todoist_id=task["id"],
                    status="To Do",
                    project=mapped_name or proj_name,
                    source="Todoist",
                )
                task_map[task["id"]] = page["id"]
                print(f"  Created: '{task['content']}' → {mapped_name or proj_name}")
            except Exception as e:
                print(f"  Failed to create '{task['content']}': {e}")
            time.sleep(0.15)

    # ── Step 4: Mark completed Todoist tasks as Done in Notion ────────────────
    print("\n--- Checking completions ---")
    for todoist_id, notion_page_id in list(task_map.items()):
        if todoist_id not in active_task_ids:
            # Task no longer active in Todoist → mark Done in Notion
            try:
                update_notion_page(notion_page_id, content="", status="Done", source="Todoist")
                print(f"  Marked Done in Notion: Todoist ID {todoist_id}")
            except Exception as e:
                print(f"  Failed to mark done {todoist_id}: {e}")

    # ── Step 5: Notion → Todoist ───────────────────────────────────────────────
    print("\n--- Notion → Todoist ---")
    notion_task_map = {v: k for k, v in task_map.items()}  # notion_page_id -> todoist_id

    for proj_name, db_id in config["project_map"].items():
        todoist_proj_id = None
        for t_id, n_name in config["todoist_project_map"].items():
            if n_name == proj_name:
                todoist_proj_id = t_id
                break

        if not todoist_proj_id:
            continue  # No Todoist project mapped yet

        try:
            pages = query_notion_db(db_id)
        except Exception as e:
            print(f"  Failed to query {proj_name} DB: {e}")
            continue

        for page in pages:
            page_id = page["id"].replace("-", "")
            todoist_id_in_notion = get_notion_prop(page, "Todoist ID", "rich_text")
            task_name = get_notion_prop(page, "Task Name", "title")
            status = get_notion_prop(page, "Status", "select")
            priority_str = get_notion_prop(page, "Priority", "select")
            due_date = get_notion_prop(page, "Due Date", "date")
            description = get_notion_prop(page, "Description", "rich_text")

            if not task_name:
                continue

            if not todoist_id_in_notion:
                # Created directly in Notion → push to Todoist
                priority_num = N2T_PRIORITY.get(priority_str, 1)
                try:
                    new_task = create_todoist_task(
                        content=task_name,
                        project_id=todoist_proj_id,
                        priority=priority_num,
                        due_date=due_date or None,
                        description=description,
                    )
                    task_map[new_task["id"]] = page["id"]
                    # Write Todoist ID back to Notion
                    update_notion_page(page["id"], content=task_name, todoist_id=new_task["id"], source="Notion")
                    print(f"  Pushed to Todoist: '{task_name}' ({proj_name})")
                except Exception as e:
                    print(f"  Failed to push '{task_name}' to Todoist: {e}")
                time.sleep(0.15)

            else:
                # Already synced — check if status changed in Notion
                if todoist_id_in_notion in active_task_ids:
                    if status == "Done":
                        # User marked Done in Notion → complete in Todoist
                        try:
                            close_todoist_task(todoist_id_in_notion)
                            print(f"  Completed in Todoist: '{task_name}'")
                        except Exception as e:
                            print(f"  Failed to complete '{task_name}' in Todoist: {e}")
                    else:
                        # Update Todoist with any changes from Notion
                        try:
                            priority_num = N2T_PRIORITY.get(priority_str, 1)
                            update_todoist_task(
                                todoist_id_in_notion,
                                content=task_name,
                                priority=priority_num,
                                due_date=due_date or None,
                                description=description,
                            )
                        except Exception as e:
                            print(f"  Failed to update Todoist task '{task_name}': {e}")

    # ── Save state ─────────────────────────────────────────────────────────────
    state["last_sync"] = datetime.now(timezone.utc).isoformat()
    state["task_map"] = task_map
    save_state(state)
    print(f"\nSync complete. {len(task_map)} tasks tracked.")


if __name__ == "__main__":
    sync()
