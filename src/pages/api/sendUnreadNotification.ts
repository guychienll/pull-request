import axios from "axios";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { Message, Blocks, Elements } from "slack-block-builder";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    githubToken,
    owner,
    repositories,
    slackWebhook,
    filter = "",
  } = req.query;
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

  const filteredPullRequests = allPullRequests.filter((pr) =>
    pr.title.includes(filter as string)
  );

  const message = Message()
    .blocks(
      Blocks.Section().text("小提醒: Sprint Need Review PRs :eyes:"),
      ...filteredPullRequests.map((pr) =>
        Blocks.Section().text(`<${pr.html_url}|${pr.title}>`)
      )
    )
    .buildToObject();

  await axios.post(slackWebhook as string, message);

  res.status(200).send("ok");
}
