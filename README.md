# oss.gg 🕹️

## Run Locally

1. Clone the project

```bash
  git clone https://github.com/formbricks/oss.gg.git
  cd oss.gg
```

2. Install dependencies

```bash
  pnpm install
```

3. Copy `.env.example` to `.env` and fill in the required environment variables

```bash
    cp .env.example .env
```

> The Github Env Vars (incl the webhook secret) can be accessed from your GitHub App Settings

4. Start the server

```bash
  pnpm dev
```

5. Run the Webhook Proxy

```bash
  smee --url https://smee.io/<your-smee-path> --path /api/github-webhook --port 3000
```

## GitHub App Configuration

- Callback URL: `http://localhost:3000/api/auth/callback`
- Setup URL: `http://localhost:3000/select-repo` (Check the **Redirect on Update** option)
- Webhook set to Active and get a URL from `https://smee.io/` by clicking on **Start a new channel** and then paste the URL in the Webhook URL field.
- Disable SSL verification for now
- Generate a Client Secret and keep it in the `.env` file
- Generate a Private Key and keep it in the `.env` file
- Copy the Client ID and keep it in the `.env` file
- Now Hit the **Save Changes** button