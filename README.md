# SkillTrade

<img width="3020" height="1592" alt="image" src="https://github.com/user-attachments/assets/fb643165-de7e-4559-a4e6-0065f80aa702" />

## About
SkillTrade is a project made at MIT Blueprint 2026, a 9-hour high school hackathon organized by HackMIT. 

## Inspiration

Ryan is bad at Valorant. Like, really bad. He’s watched countless YouTube tutorials and asked his friends for tips, all to no avail. He would hire a coach, but he’s a broke, jobless high school student. He needs a coach who needs a coach, just in something else like math, which Ryan IS good at. Then he realized how many of his peers were in a similar situation and, voila, the concept for SkillTrade was born.

The inspiration for this project’s algorithm also came from Alan’s love for algorithms and competitive programming. One particular algorithm is called depth-first search, which can be used to find cycles in a graph. Using this, we built a website that applies the concept to match skill trades between different users. 

## What it does

Our project helps pair you with someone else to trade skills with! Let’s say you are proficient in math and can tutor someone in AP Calculus, but you’re struggling with writing your English essay. Our website pairs you with another person who can help you write your essay and who needs help in AP Calculus. But this project is not limited only to trades between two people. It can also find trades involving multiple people, forming a cycle! For example, user A teaches user B, who teaches user C, who teaches user B. Finding trades involving many people makes it much more likely to find cycles and learn the skills you desire.

## How we built it

Frontend: TypeScript and TailwindCSS were used to create a React/Next.js app with 4 primary pages: Landing, Dashboard, Meetings, and Profile. Each page is populated by components (with some adapted from open-source websites like ReactBits and 21st.dev), such as cards and buttons that handle that page’s functionality.

Backend: The trades, user information, cycles, and meetings are stored in Firebase. We wrote a TypeScript “worker” that periodically fetches a queue collection in Firebase to complete tasks such as adding trades, removing trades, and finding cycles.

We used ChatGPT for external debugging, as well as Cursor to assist in building the frontend and its skeleton (specifically the Tailwind classes).

## Individual Contributions

Ryan worked primarily with Heona on frontend and UI/UX design (specifically, the Landing and Dashboard pages). Additionally, they managed to implement component functionality before combining with the backend data. Alan was responsible for designing the database structure and writing the backend code. He also created the basic project structure and set up Firebase. 

## Challenges we ran into

This was also our first time building and iterating at such a rapid pace, which required consistent, intense focus and trust amongst each other.

On the frontend side, designing an efficient interface for users was the main challenge. We wanted to compact many features into just a few pages, but several cycles of testing and feedback allowed us to arrive at intuitive designs.

Another challenge was the efficiency problems that arose with writing the backend code. At first, our depth-first search involved calling and retrieving from the database. However, as the project scales, this becomes too slow. To solve this, we used the backend’s memory as a “cache” that was synced to Firebase. This way, we can run DFS by using the nodes and edges in our memory, which is much faster than fetching from the database. Of course, that wasn’t the only challenge. Since the data in Firestore references each other, it was hard to implement the “delete-edge” functionality. After hours of debugging and ensuring that all dependent references were deleted in the database, we finally had a working version of the utility functions.

## Accomplishments that we're proud of

One accomplishment that we’re proud of is how efficiently we divided work. Since our group was composed of diverse people with different skillsets, we worked simultaneously on different parts of the project. For example, Alan was very good at debugging and working with the backend. To assist in this, Ryan and Heona developed a scaffolded version with dummy values of the data. To achieve this, we used GitHub branches to maintain a clear separation of work that could easily be merged back together. This is also one of the first times Ryan and Heona worked with the Next.js framework, so building on our knowledge of React.js, each step was a learning process.

## What we learned

Since this was the first hackathon for all of us, we learned valuable skills such as effective communication and the division of work. For instance, we were able to successfully leverage our strengths and weaknesses while delegating the frontend and backend tasks to different people. This greatly improved efficiency and planning ahead throughout the hackathon. Regarding the project, we were able to create a deployable app that solves a problem that is very important and relevant to us, proving that it’s possible to build a usable tool ourselves to solve a real-world problem. 

## What's next for our project

We are looking to extend our project in several ways. With more time to ideate, design, and build, our group would implement other features, such as a more complex algorithm that depended on the time users were willing to commit to. Other prospective features include the ability to add friends, message, and give ratings to one another. The last feature specifically allows trustworthy people to be recommended and ensures a fair environment. The frontend layout can also be more polished, relying on more than simple cards, resulting in a more pleasant user experience.

## Useful Links
Video Demo: https://www.youtube.com/watch?v=fsbw0sRnPw4
<br>
Plume: https://plume.hackmit.org/project/pzlck-ousva-tjzni-mhcpa
