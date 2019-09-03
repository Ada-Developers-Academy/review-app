# Ada Developers Academy Code Review App
An application to support and manage volunteers who provide code reviews to Ada students

## Summary
This app was created by Textio volunteers as part of the 2019 Q3 Textio Community Explorathon. Since it was created in about 2 days, it is most definitely a work in progress.

### Problem
Ada assigns students CS Fundamentals homework via GitHub PRs that are code reviewed by volunteers and instructors. The current workflow to onboard and manage volunteers is highly manual and necessitates a lot of coordination and communication. Volunteer reviewers have difficulty tracking which reviews are assigned to them and understanding how to appropriately conduct reviews, which creates obstacles to volunteer adoption and retention.

### Mission
The overarching goal of the project is to make it easier for volunteers to join the platform and review students' PRs and for instructors to manage volunteers' workflows.

## Tech Overview
The app was created with create-react-app and consists of a React frontend and a minimal Firebase Realtime Database as the backend. It mostly relies on the GitHub API for information about repos, users, etc., thereby persisting only minimal data in the database. The database stores only the info required to associated a PR with it's assigned red/yellow/green grade and provide a direct link to the comment on GitHub.

## Specific Goals

### Completed
- Create a new web app with a React frontend and Firebase or Rails backend
- Create design documents to visualize requested features
- Volunteers and instructors can login using GitHub credentials
- Volunteers' primary view shows the PRs they've been assigned
- Instructors' primary view shows PRs assigned to all reviewers
- PR list includes student, project link, assigned reviewer (for instructor view), review status, red/yellow/green grade for completed reviews.
- Incomplete reviews are shown at the top
- Reviewers can provide structured feedback.
    - Content of feedback.md is populated into the structured feedback text box
- Reviewers can provide a red/yellow/green grade
- Reviews are not considered complete until the review has provided structured feedback, at least one review comment, and a red/yellow/green grade. [IS THIS FULLY COMPLETED?]
- Red/yellow/green grades can be updated (from the PR list view) after initial review submission.

### Partially Completed
- Red/yellow/green grade can be updated from the PR list view. [STATUS?]
- Volunteers are shown guidance about how to conduct a high-quality review.
    - **Status:** View exists with placeholder text; copy needed. "Read more" link is not connected. "Contact an administrator" link is not connected.
- PR list UX
    - **Status:** Functionality is there, but did not include different coloring for completed reviews or arrow in the grade change dropdown

### Not Completed
- Deploy to Heroku
- Search bar
- Filters
- Onboarding UI on first sign in of a new volunteer
- Assign PRs to reviewers

### Workflow
To support the distinction between volunteers and instructors, we use GitHub teams. This is still a mostly manual process, but many of the steps below could be automated in a future extension of the project.
1) Choose a "primary" Ada GitHub org that will hold the volunteers and instructors of record.
2) Create two teams in that org: "volunteers" and "instructors". (Names can be changed by updating `/constants.ts` and the `UserRole` type in `fetchFromGitHub.ts`.) Populate these teams with the correct instructor and volunteer members. The app will read from these teams to determine a user's access.
3) Update `/constants.ts` with the teams' IDs (can be obtained with an [authed](https://developer.github.com/v3/#authentication) GET request by a repo owner to `https://api.github.com/orgs/ada-code-review/teams/:team_name`).
3) Since Ada's codebase is divided into a GitHub org for each cohort, the list of cohorts must be manually updated in the code. Add the name of each organization to `GITHUB_ORGS` in `/constants.ts`.
4) When assigning an instructor or a volunteer a PR to review, add them to the PR as an **assignee** (not a reviewer, due to limitations of the reviewer API). The assignee is used to determine which reviews are assigned to a homework reviewer. The assignee must be added as a member of the org. (A future extension of the project could use the GitHub API to: Have a selector for instructors to assign reviews that 1) adds the homework reviewer to the org if they aren't a member already and 2) adds the reviewer to the PR as an assignee.)

## Known Bugs/Issues
- [ANY ISSUES WITH GITHUB ACCESS/SECURITY?]
- We set the Firebase Realtime Database permissions to be open to all reads/writes. This should be refined for production. [ELY, CAN WE TRANSFER OWNERSHIP OF DB TO CHRIS? OR DOES HE NEED TO CREATE A NEW DB & UPDATE CONFIG?]
- Firebase API key is checked in to GitHub (see `firebaseConfig.js`) but should probably be an environment variable.
- Possible memory leak (see `firebaseConfig.js`) [ELY, ADD DETAILS?]
- Could be issues with rate limiting in the GitHub API. Most of the endpoints use the search API, which allows 30 authed requests per minute. If so, replacing calls to their REST API with the GraphQL API would likely remediate.
- Code structure is not as well-factored as we'd like.
- In unauthorized user view, "contact an administrator" link is not connected (see `UnauthorizedPage.tsx`).
- In volunteer PR list and sign in views, "read more" link is not connected (see `ListPage.tsx`, `SignInPage.tsx`).
- [ALL CONTRIBUTORS: PLS REVIEW TODOs AND ADD HERE OR REMOVE]

## Additional information
- [Trello board](https://trello.com/c/T5brtgAI/17-feedback-submission-v2-checker)
- [Designs in Figma](https://www.figma.com/file/FZKpIQyavnos1OrKuJp4Q3/Ada-Volunteer-Portal-Exp-Q319?node-id=15%3A0)
- Contact at Textio: Sally Moore, sally@textio.com

### GitHub Endpoints
List of endpoints were used to support the existing functionality _or_ would likely be used for some of the extensions we did not complete.

|Data|Where used|Request|
|---|---|---|
|Retrieve all PRs that are open, in specified orgs, and assigned to the specified github user|Volunteer view|GET https://api.github.com/search/issues?q=is:pr+is:open+org:[org_name]+org:[name  of  org>+assignee:[github  username]&per_page=100&sort=updated&order=desc|
|Get all PRs that are open for specified orgs|Instructor view|GET https://api.github.com/search/issues?q=is:pr+is:open+org:[name  of  org]+org:[name  of  org]&per_page=100&sort=updated&order=desc|
|Get teams for specified user|Login: User Permissions|GET https://api.github.com/user/teams|
|Retrieve feedback.md text from repo|Feedback view|GET https://raw.githubusercontent.com/ada-code-review/calculator/master/feedback.md|
|Individual Pull Request data, including whether PR has any review comments|Feedback view|GET https://api.github.com/repos/:org/:repo/pulls/:id|
|Submit comment (feedback) on PR|Feedback view|POST https://api.github.com/repos/:org/:repo/issues/:id/comments (URL can be retrieved from individual PR data above in `["_links"]["comments"]`)|
|Add user as a member to org|Not implemented (assign PR to volunteer)|PUT /orgs/:org/memberships/:username|
|Assign user to teams in org|Not implemented (assign PR to volunteer)|**To get team id:** <br>GET https://api.github.com/orgs/ada-code-review/teams/:team_slug. <br>**To add user:**<br> PUT https://api.github.com/teams/:team_id/memberships/:username|
|Add a user to a PR as an assignee|Not implemented (assign PR to volunteer)|POST https://api.github.com/repos/:owner/:repo/issues/:issue_number/assignees|

# Boilerplate from Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
