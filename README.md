# oss.gg 🕹️

Thanks for your interest in contributing to oss.gg

In this manual we'll walk you through the steps you need to take to get oss.gg and your own GitHub app up and running. It consists of four parts:

1. GitHub SSO Configuration (make the login with GitHub work)
2. oss.gg Github App Setup (setup your own version of the oss.gg GitHub app)
3. Run oss.gg server locally
4. Start the local instance of oss.gg with your GitHub test app and install oss.gg on test repository

## 1. GitHub SSO Configuration
oss.gg only works with GitHub sign up and login. To make it work locally, you need to fill in these .env variables:

`GITHUB_APP_CLIENT_ID=`
`GITHUB_APP_CLIENT_SECRET=`
`GITHUB_APP_ACCESS_TOKEN=`

Go to your GitHub account Settings -> Developer Settings -> OAuth Apps:

<img width="778" alt="image" src="https://github.com/formbricks/oss.gg/assets/72809645/8d2d2bf3-63ef-4c97-bc94-b08a6a23b515">

Set it up as follows:

<img width="597" alt="image" src="https://github.com/formbricks/oss.gg/assets/72809645/2c5ea5aa-2ac3-4c20-b389-7c1815ffa040">

Fill in these env variables:

`GITHUB_APP_CLIENT_ID=`
`GITHUB_APP_CLIENT_SECRET=`

Now go to Personal Access Token:

<img width="1145" alt="image" src="https://github.com/formbricks/oss.gg/assets/72809645/56674a44-29b8-4297-9048-4974b50921ce">

Generate one and fill it in the env variable. 

All set for the GitHub login 💪

Let's setup your oss.gg GitHub App 👇

## 2. oss.gg Github App Setup
You need to create your own GitHub app to test the oss.gg functionality you're developing in your test repo.

Stay in your GitHub Account Settings -> Developer Settings -> GitHub Apps and Create a New App:

<img width="1191" alt="image" src="https://github.com/formbricks/oss.gg/assets/72809645/b204e4e2-7afe-4faf-ae80-ce1d25f40128">

Set it up as follows:

- Callback URL: `http://localhost:3000/api/auth/callback`
- Setup URL: `http://localhost:3000/select-repo` (Check the **Redirect on Update** option)
- Webhook set to Active and get a URL from `https://smee.io/` by clicking on **Start a new channel** and then paste the URL in the Webhook URL field.
- Disable SSL verification for now
- Hit "Create GitHub App"
- Copy the Client ID and keep it in the `.env` file (at the top of the page)
- Generate a Client Secret and keep it in the `.env` file
- Generate a Private Key and keep it in the `.env` file
- Now Hit the **Save Changes** button

Fill in these env varibales with the data you get on the app detail page:

`GITHUB_APP_WEBHOOK_SECRET`
`GITHUB_APP_ID`
`GITHUB_APP_SLUG`

Lastly, you need to fill in the `GITHUB_APP_PRIVATE_KEY` variable.

This key comes in a .pem file. Open it and copy the code enclosed in double quotes, like so:

<img width="607" alt="image" src="https://github.com/formbricks/oss.gg/assets/72809645/6a903710-d314-4503-8357-8cc11b756fd0">

All set 👍

## 2. Run oss.gg server locally

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

There is a bunch of differnet env variables which aren't always neccessary. I've prefilled the ones most contributors likely don't need in the env-example.

The `NEXTAUTH_SECRET` you can generate with the command written in the command below it.

4. Start the server

```bash
  pnpm dev
```

5. Run the Webhook Proxy

```bash
  smee --url https://smee.io/<your-smee-path> --path /api/github-webhook --port 3000
```

## 4. Start the local instance of oss.gg with your GitHub test app and install oss.gg on test repository
Please follow this video: https://youtu.be/KkKwqcw-h-k

#Got stuck?

Please join our Discord and let us know so we can update this guide 🤓: oss.gg/discord
