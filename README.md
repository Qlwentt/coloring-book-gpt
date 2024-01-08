# README

See the deployed site at https://coloring-book-gpt.wl.r.appspot.com/

**Architectural Decisions:**

_Image Generation (Midjourney vs DALLE):_ I opted for Midjourney over DALLE-3, primarily due to DALLE-3's rate limit of one image per minute and some issues with image quality with DALLE. For creating a 12-page coloring book in real-time, Midjourney's ability to generate 12 images in under a minute was a game-changer. However, this choice also brought challenges due to the absence of an official API (I'm using a third party, unofficial API). Architeture-wise, going with Midjourney necessitated a webhook setup for the API to push images updates to and it also required polling to check for updates. This was a more complex solution than the simple API call I would have needed for DALLE-3.

_Authentication (Omni-Auth with Google):_ For user authentication, I utilized Omni-Auth with Google. This approach negated the need for handling password storage while maintaining robust security. The decision to manage authentication on the backend was driven by the desire to keep the front-end as simple as possible, and let Rails handle the heavy lifting.

_Database Schema (Many-to-Many Relationship):_ The database schema was designed with a many-to-many relationship between users and books. While the current application associates books primarily with individual users, I envisioned future adaptability where users can share books while maintaining individual purchase statuses.

**What I Would Do Differently:**

Reflecting on the development process, there are several enhancements I would prioritize for future iterations:

_Advanced Real-Time Updates_: While polling served its purpose, adopting Websockets would offer a more efficient and scalable solution for real-time updates. This would significantly reduce server load and improve the user experience with faster, smoother updates.

_Robust Logging and Monitoring:_ Incorporating a comprehensive logging system like Sentry or New Relic would be crucial for production. It would not only help in proactive error tracking but also in understanding user behavior and app performance, facilitating quicker responses to issues and informed decision-making for future updates.

_Comprehensive Testing:_ I was focused on building out a proof-of-concept for the project, so I did not prioritize testing. However, for a production-ready application, I would implement a robust testing suite with unit, integration, and end-to-end tests.

_Optimized Image Handling:_ Given the central role of image processing in the app, exploring more efficient image handling and storage solutions would be a priority. Techniques like lazy loading and image compression could enhance performance and reduce load times.

_User Interface Improvements:_ User experience can always be refined. I would focus on iterative design improvements based on user feedback, ensuring the interface is not just functional but also intuitive and engaging.

**Key Learnings:**

This project was a profound learning curve, offering insights into both technical and project management aspects:

_Deeper Dive into Rails and React:_ The project solidified my understanding of Rails' robust back-end capabilities and React's dynamic front-end features. It highlighted the power of integrating these two technologies for a seamless user experience.

_Exploration of Webhooks and Polling:_ Implementing webhooks and polling for real-time updates was both challenging and enlightening. It taught me valuable lessons in handling asynchronous processes and the importance of choosing the right method for the task at hand.

_Image Processing with External APIs:_ Working with Midjourney and manipulating images using ImageMagick provided practical experience in integrating external APIs and handling media files, enhancing my skills in building media-rich applications.

_Adaptive Problem-Solving:_ Throughout the development process, I learned to adapt quickly to unexpected challenges, whether it was rate limits of APIs or unanticipated user behavior. This adaptability proved crucial in finding effective solutions under pressure.

_User-Centered Design Thinking:_ The project reinforced the importance of keeping the end-user in mind. It emphasized the need for designing applications that are not just technically sound but also user-friendly and engaging.
