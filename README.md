# ShelfWise Library Management System — Direct HTML Edition

## Open without running Python
1. Extract the ZIP file.
2. Open the `ssss` folder.
3. Double-click **index.html**. It opens the login page if you are signed out, or the dashboard if you are already signed in.
4. On first use only, choose **Create first Admin account** and create a strong password (10+ characters).
5. The Admin creates Librarian accounts from **Manage Librarians**.

## Roles in this offline edition
- **Admin:** full access, including reports, adding/editing/deleting books and students, and managing Librarian accounts.
- **Librarian:** can view the catalog and student list, and use issue/return pages. The Librarian cannot see Reports or Manage Librarians and cannot edit book/student records through the interface.

## Sample data
On first sign-in, ShelfWise creates five sample books and three sample student records. You can update these records while signed in as Admin.

## Important security limitation — please read
This edition is designed to open directly from `index.html` with no terminal or Python command. Because it runs entirely inside the browser (`file://`) and stores data in browser localStorage, its login and role restrictions provide **basic privacy against casual access only**. They are not genuine server-enforced security: someone with access to the same Windows account/browser profile or project files can inspect or change local data and bypass client-side restrictions. Do not use it for confidential real student records or important passwords. For strong Admin privacy and reliable multi-user security, a server-backed version (or a packaged desktop app with a protected local service) is required.

## Data storage
Books, students, transactions and accounts are stored in this browser profile on this computer. Clearing browser data may erase them. Export CSV records regularly and keep a backup of the folder.
