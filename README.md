### Serverless App Interview

This was fun for me! I really appreciate the thoughtfulness of the demo. I've added loading for each of the buttons. The search functionality is case sensitive and is a very naive w/ string matching (`includes`). I spent roughly 3 hours getting things setup, installing xcode so I could build the `react-loading-skeleton` libraries, digging through documentation and implementation.

Things I changed:
1. added `react-loading-skeleton` cause the look of facebook loading is sleak (I was going to add a spinner, but that would either require a gif or updating bootstrap so I went for something else)
2. added basic search
3. added search + replace functionality
4. added alerts for errors/success on home page
5. using `history.push` to redirect to yourself comes with its own issues, so instead I went ahead and reset fields + refetched notes (we could have done this in memory, but stuck with refetch since it was easiest)
6. added `clear` method for form fields helper lib
7. Added back button to Notes page

Things I noted:
1. using older version of bootstrap
2. Serverless docs are pretty solid in understanding how things work and they seem to have a set style/opinion on how they want you to code
3. some deps are giving us errors with `npm audit`
4. Looks like this is using older syntax for react? My recent experience deals with creating classes/components and handling state through props/state w/ redux.
5. Tests wont run and looks like others were having issues via github. Have other users gotten these tests to work?
6. Situation of search/replace is not ideal, but I liked the idea of having search be prominent on this screen. There is probably an addition that can be made for an Actions bar that allows settings like search/replace or marking different notes w/ information

Other things i'd like to work on:
1. linting or running `npm test` before being able to commit changes/merge changes
2. Work with product to figure out what we all thought was a better user experience between loading spinner or content loading
3. Updating bootstrap to use newer components?

### Instructions given below

Hi Danny,

Below you'll find the instructions for your Osmind assessment project. It shouldn't take more than a few days to complete. This is the same assessment we've given all the other engineering candidates, but with an increased level of difficulty. In addition to this project, please share with me a project of yours that showcases your full-stack engineering skills, nodeJS, or React.
This is due Tuesday, 10/27. The sooner you turn in the assessment the sooner we can get back to you with a decision on an offer.


Please clone the following git repo: https://github.com/AnomalyInnovations/serverless-stack-demo-client.
This is a demo app from the Serverless Framework which implements simple note-taking functionality.
 Go ahead and boot it up on localhost, create an account, and try out the existing functionality.

Like Osmind's website for doctors, this is a single-page React app backed by a serverless API and DynamoDB. The folks at Serverless Framework have hosted the API and DB so that anyone can use them, and the frontend already points to that API by default. For this project, you'll only be making changes to this React frontend repo; you won't have to touch the API. Almost all of your changes for this assignment will happen in the Home.js file.

You can find a step-by-step full-stack walkthrough of how this app works/how to create it from scratch here: https://serverless-stack.com/. There's a lot of content in that tutorial, so you definitely don't need to read the whole thing. However, some parts of it might provide useful info.

Your task is to make the following three improvements to the app:

1 - Search notes: Implement functionality on the homescreen that allows the user to search for notes containing a specific string.
2 - Bulk find-and-replace: Implement functionality that allows the user to replace all occurrences of a given string across all saved notes, with a new string supplied by the user. For example, I should be able to replace "Sam" with "Danny" in all of my saved notes with one button press.
3 - Loading indicator - make it so that some kind of indicator appears while all the notes are being retrieved from the API for the homescreen, when an individual note is being loaded for viewing, and when find-and-replace is in progress.

These functionalities should be bug-free and have a simple, intuitive UX. The design and implementation is completely up to you.

When you're finished, please upload the project to github (don't forget to make it public) and send me the link!
I look forward to seeing your work, please let me know if you have any questions. Good luck!

Best,
Sam
