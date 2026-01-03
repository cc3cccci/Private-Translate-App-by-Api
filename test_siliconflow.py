import urllib.request
import urllib.error
import json
import os
import sys
import concurrent.futures
import time

# Try to read .env from web/.env or current directory
def load_env():
    env_paths = [
        os.path.join(os.getcwd(), 'web', '.env'),
        os.path.join(os.getcwd(), '.env')
    ]
    
    env_vars = {}
    
    for path in env_paths:
        if os.path.exists(path):
            print(f"Reading env from: {path}")
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    for line in f:
                        line = line.strip()
                        if not line or line.startswith('#'):
                            continue
                        if '=' in line:
                            key, value = line.split('=', 1)
                            # Remove quotes if present
                            value = value.strip()
                            if (value.startswith('"') and value.endswith('"')) or \
                               (value.startswith("'") and value.endswith("'")):
                                value = value[1:-1]
                            env_vars[key.strip()] = value
            except Exception as e:
                print(f"Error reading {path}: {e}")
            if "CUSTOM_1_KEY" in env_vars:
                return env_vars
    return env_vars

def test_single_model(model_id, base_url, headers):
    """
    Test a single model with a minimal chat completion request.
    Returns (model_id, status, details)
    """
    payload = {
        "model": model_id,
        "messages": [
            {"role": "user", "content": "hi"}
        ],
        "stream": False,
        "max_tokens": 10
    }
    
    start_time = time.time()
    try:
        req = urllib.request.Request(
            f"{base_url}/chat/completions", 
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode())
            choices = data.get('choices', [])
            duration = time.time() - start_time
            if choices:
                return (model_id, "SUCCESS", f"{duration:.2f}s")
            else:
                return (model_id, "FAILED", "No choices returned")
    except urllib.error.HTTPError as e:
        return (model_id, "FAILED", f"HTTP {e.code}: {e.reason}")
    except Exception as e:
        return (model_id, "FAILED", str(e))

def main():
    env = load_env()
    
    api_key = env.get("CUSTOM_1_KEY")
    base_url = env.get("CUSTOM_1_BASE_URL", "https://api.siliconflow.cn/v1")
    
    if not api_key:
        print("Error: CUSTOM_1_KEY not found in web/.env or .env")
        api_key = "sk-ufnlgmjydarocovcwmymkjdamzgkihbngubrblankjsvyilz"
        print("Using fallback key for testing...")

    print(f"Target URL: {base_url}")
    print(f"API Key: {api_key[:10]}...")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "SiliconFlowTest/1.0"
    }

    # 1. Fetch Model List
    print("\n--- Fetching Model List ---")
    models = []
    try:
        req = urllib.request.Request(f"{base_url}/models", headers=headers, method="GET")
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            model_list = data.get('data', [])
            # Filter for likely chat models if needed, but we'll test all
            models = [m.get('id') for m in model_list if m.get('id')]
            print(f"Found {len(models)} models.")
    except Exception as e:
        print(f"Error fetching models: {e}")
        return

    if not models:
        print("No models found to test.")
        return

    # 2. Test Models in Parallel
    print(f"\n--- Testing {len(models)} Models (Concurrency: 5) ---")
    print("This may take a minute...")
    
    results = []
    # Use ThreadPoolExecutor to run tests in parallel
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        future_to_model = {
            executor.submit(test_single_model, m, base_url, headers): m 
            for m in models
        }
        
        completed_count = 0
        for future in concurrent.futures.as_completed(future_to_model):
            model_id = future_to_model[future]
            try:
                result = future.result()
                results.append(result)
                
                # Live progress update
                completed_count += 1
                status = result[1]
                # Print only failures or every 10th success to keep output clean? 
                # Or just print everything since user asked to traverse.
                print(f"[{completed_count}/{len(models)}] {model_id}: {status}")
                
            except Exception as exc:
                print(f"{model_id} generated an exception: {exc}")

    # 3. Summary
    print("\n" + "="*50)
    print("TEST REPORT")
    print("="*50)
    
    success_models = [r for r in results if r[1] == "SUCCESS"]
    failed_models = [r for r in results if r[1] == "FAILED"]
    
    print(f"Total Tested: {len(models)}")
    print(f"Working:      {len(success_models)}")
    print(f"Failed:       {len(failed_models)}")
    
    print("\n--- AVAILABLE MODELS ---")
    for r in success_models:
        print(f"[✓] {r[0]} ({r[2]})")
        
    if failed_models:
        print("\n--- FAILED MODELS (Sample) ---")
        for r in failed_models[:10]:
             print(f"[x] {r[0]}: {r[2]}")
        if len(failed_models) > 10:
            print(f"... and {len(failed_models)-10} more.")

if __name__ == "__main__":
    main()
