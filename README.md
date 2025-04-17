# SUGE SERVER

## Description

This services handles the admin login, blog post, popup generation and the quotes. It also handles the display of the blogs and popups

### Routes - Admin routes
 * admin/login `POST` - handles the admin login.
 * admin/profile `GET` - handles admin authentication.
 * admin/ `POST` - handles blog creation.
 * admin/:id `PUT` - handles the blog editing.
 * admin/:id `DELETE` - deletes a blog.
 * admin/popups `GET` - returns the list of the created popups.
 * admin/popup-message `POST` - handles popup creations.
 * admin/popup-message/:id `DELETE` - deletes a popup.
 * admin/activate-popup/:id `PUT` - activates a Popup.
 * admin/deactivate-popup/:id `PUT` - deactivates a Popup.
 * admin/edit-popup/:id `PUT` - edits a popup content

### Routes description - Popup activation
 * admin/activate-popup/:id - Only one popup can be activated at a time since the popup is only shown on the landing-page on load. Once a Popup is acivated, all other popups becomes unactivated


### Routes - Accessible to users also
 * blog/ `GET` - returns a list of all available blogs.
 * blog/:id `GET` - returns the blogs with that id.
 * blog/active-popup `GET` - returns the popup that is activated