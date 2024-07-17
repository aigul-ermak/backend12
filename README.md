# Blogger Platform - Sprint 3, Week 3

## Overview

This sprint focuses on implementing the functionality to display likes and dislikes on comments within the Blogger Platform. Authenticated users will have the ability to like or dislike comments on posts. This enhancement involves both frontend and backend development to ensure a seamless user experience.

## User Story: UC-1. Displaying Likes/Dislikes on Comments

### Frontend Implementation

The following functionalities will be implemented on the frontend:

1. **Displaying Likes/Dislikes on Comments**
    - Authenticated users can view the number of likes (thumbs up) and dislikes (thumbs down) on each comment.
    - Authenticated users can like or dislike a comment.

2. **Design**
    - Sprint: 3
    - Blogger Platform

### Backend Implementation

The backend will involve creating an endpoint to handle the like/dislike functionality:

- **Endpoint Creation:**
    - **PUT** - `api/comments/{commentId}/like-status`
    - Refer to the Swagger API documentation (h11 API) for detailed information.

## Use Case: UC-1. Displaying Likes/Dislikes on Comments

### Description

As an authenticated user, I want to like or dislike a comment under a post.

### Scenario

**Main Scenario:**

1. The authenticated user is on the page of a selected post.
2. The authenticated user can see the number of likes (thumbs up) and dislikes (thumbs down) under each comment.
3. The authenticated user likes a comment.
4. The system updates the number of likes and highlights the "Like" attribute.
    - The user sees their like, which they placed on the comment (the attribute is highlighted).

**Alternative Scenario:**

1. Steps 1-2 of the main scenario.
2. The authenticated user dislikes a comment.
3. The system updates the number of dislikes and highlights the "Dislike" attribute.
    - The user sees their dislike, which they placed on the comment (the attribute is highlighted).

## Notes

- Ensure that only authenticated users can like or dislike comments.
- The UI should clearly indicate which comments have been liked or disliked by the user.
- The backend should handle the like/dislike logic and update the comment status accordingly.
- Refer to the Swagger API documentation for detailed endpoint usage and parameters.

This concludes the tasks and details for Sprint 3, Week 3 for the Blogger Platform project.
