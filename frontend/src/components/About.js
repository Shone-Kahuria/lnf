import React from 'react';

function About() {
  return (
    <div className="container my-4">
      <h2>About Lost and Found</h2>
      <p>
        The Lost and Found application is designed to help Strathmore University students and staff efficiently manage lost and found items on campus.
        Students can report lost items and claim found items through this platform.
      </p>
      <p>
        Admins have the ability to manage all items, including updating statuses and removing items as necessary to keep the system accurate and up to date.
      </p>
      <p>
        When a student claims an item, they are requested to visit the Lost and Found office to identify the item and complete the claim process.
      </p>
      <p>
        This project aims to simplify the process of tracking and recovering lost possessions by providing a user-friendly interface and seamless backend integration.
        It supports real-time updates and notifications to keep users informed.
      </p>
      <p>
        Built with React for the frontend and Node.js/Express for the backend, the application ensures a responsive and reliable experience.
      </p>
    </div>
  );
}

export default About;
