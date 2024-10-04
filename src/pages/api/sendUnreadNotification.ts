import axios from "axios";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { githubToken, owner, repositories, slackWebhook } = req.query;
  const repos = (repositories as string).split(",");

  const response = await Promise.allSettled(
    repos.map((repository) =>
      axios.get(`https://api.github.com/repos/${owner}/${repository}/pulls`, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      })
    )
  );

  const allPullRequests = _.flatten(
    response
      .filter(
        (result): result is PromiseFulfilledResult<any> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value.data)
  );

  const filteredPullRequests = allPullRequests
    .filter((pr) => pr.labels.some((label: any) => label.name === "reviewable"))
    .filter((pr) => !pr.draft)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  let message = null;

  if (filteredPullRequests.length > 0) {
    message = {
      text: "Sprint 需要 review 的 PR",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🚀 Sprint 需要 review 的 PR",
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `共有 ${filteredPullRequests.length} 個 PR 需要 review`,
            },
          ],
        },
        ...filteredPullRequests.map((pr) => ({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*<${pr.html_url}|${pr.title}>*\n作者: ${pr.user.login} | 創建於: ${new Date(pr.created_at).toLocaleString("zh-TW")}`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "查看 PR 👀",
              emoji: true,
            },
            url: pr.html_url,
            action_id: "button-action",
          },
        })),
        {
          type: "divider",
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "請及時 review 以上 PR，以確保開發進度 💪",
            },
          ],
        },
      ],
    };
  } else {
    message = {
      text: "🎉 今天沒有需要 review 的 PR，大家辛苦了！",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎉 今天沒有需要 review 的 PR，大家辛苦了！",
            emoji: true,
          },
        },
        {
          type: "image",
          image_url:
            "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExczZpNjdybXBkb213YmM3b3Y1MjhzNG04emJ2ZXY3ZDdreG8xM3hweiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kyLYXonQYYfwYDIeZl/giphy.gif",
          alt_text: "gif",
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "今天是個好日子，讓我們繼續保持這樣的工作效率！💪",
            },
          ],
        },
      ],
    };
  }

  await axios.post(slackWebhook as string, message);

  res.status(200).send("ok");
}
