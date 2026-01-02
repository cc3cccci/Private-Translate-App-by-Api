# Deployment Guide

## 1. Push to GitHub

Since your project has a `docker-compose.yml` in the root and the Next.js app in `web/`, it is best to track the entire project as one repository.

### Consolidate Repository
Running these commands will make the root directory the main repository and include your Docker configuration.

```bash
# 1. Initialize Git in the root folder
cd /Users/mingxin/Documents/Auti-Gravity
git init

# 2. (Optional) Remove the nested git setup inside 'web' to avoid submodule issues
# WARNING: This resets git history for 'web', but keeps files intact.
rm -rf web/.git

# 3. Create a root .gitignore to protect secrets
echo ".env" >> .gitignore
echo "web/.env" >> .gitignore
echo "web/node_modules" >> .gitignore
echo "web/.next" >> .gitignore
```

### Push Code
```bash
git add .
git commit -m "Initial commit: Private Translate App"

# Replace <YOUR_REPO_URL> with your actual GitHub repository URL
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

---

## 2. Deploy to VPS

### Prerequisites
- A VPS (Ubuntu/Debian recommended) with **Docker** and **Docker Compose** installed.
- SSH access to the VPS.

### Deployment Steps

1.  **Clone the Repository on VPS**:
    ```bash
    # SSH into your VPS
    ssh user@your-vps-ip

    # Clone the project
    git clone <YOUR_REPO_URL> private-translate
    cd private-translate
    ```

2.  **Configure Environment Variables**:
    You need to manually create the `.env` file on the VPS because it was excluded from Git for security.
    ```bash
    # Create web/.env
    nano web/.env
    ```
    *Paste your production credentials (database URL, API keys, etc.) into this file.*

    **Example `web/.env`**:
    ```env
    DATABASE_URL="postgresql://postgres:postgres@db:5432/private_translate"
    DEEPSEEK_KEY="your-deepseek-key-here"
    DEFAULT_MODEL="deepseek-chat"
    ```

3.  **Start the Application**:
    ```bash
    docker-compose up -d --build
    ```

4.  **Verify**:
    - Check logs: `docker-compose logs -f`
    - Application should be running at `http://<VPS-IP>:3000`

### Updating
When you make changes locally:
1.  `git push origin main`
2.  On VPS: `git pull && docker-compose up -d --build`
