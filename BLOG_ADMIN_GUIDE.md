# Panda Towers CMS – Blog & Articles Administrator Guide

This guide explains how administrators and editors can independently create, upload images, edit, publish, unpublish, and delete articles on the Panda Towers website without needing developer assistance.

---

## 1. Accessing the Blog Management Dashboard

1. Open the CMS in your browser and sign in at `/login`.
2. In the left navigation sidebar under **Content**, click **Blog** (or go directly to `/cms/blog`).
3. At the top of the **Blog & Articles** dashboard, you will see:
   - **Summary Cards**: Click **Total Articles**, **Published**, **Drafts**, or **Featured** to quickly filter the list.
   - **Search & Filter Bar**: Search by title, summary, author, or category, or switch between **Table View** and **Cards View**.
   - **Header Buttons**:
     - **Admin Guide**: Opens the built-in quick reference guide inside the CMS.
     - **Live Website Blog**: Opens `/blog` to view the live public blog page.
     - **Categories**: Manage article categories and color tags.
     - **New Article**: Create a new blog post.

---

## 2. Creating & Publishing a New Article

1. Click the green **New Article** button in the top-right corner of `/cms/blog`.
2. Fill in the **Article Content** section:
   - **Article Title** *(Required)*: Enter the headline of your article (e.g., *"Why Real Estate Investment Remains King"*).
   - **URL Slug**: Automatically generated from the title. You can leave it as-is or customize it.
   - **Reading Time**: Automatically calculated as you write your content (e.g., `5 min read`), or you can type a custom value.
   - **Article Excerpt / Summary**: Write a short 1–2 sentence summary shown on article cards. You can also click **Auto-fill from content** after writing the body to generate this automatically.
   - **Content Body**: Write and format your article using the rich-text toolbar (headings, bold/italic, bulleted/numbered lists, blockquotes, links, and inline images).
3. Configure **Author & Category** (right sidebar):
   - **Author Account**: Choose an existing CMS user or select **Custom Author Name**.
   - **Displayed Author Name**: Customize the byline name displayed on the website (e.g., *"Panda Towers Research"*).
   - **Article Category**: Select a category from the dropdown, or click **+ New Category** to create a new category on the spot without leaving the page.
4. Upload a **Featured Cover Image** (right sidebar):
   - Drag and drop an image file (`JPG`, `PNG`, `WebP`, or `GIF`, up to **10 MB**) directly onto the upload box, or click **Upload File**.
   - To reuse an existing image, click **Browse Library**, search for your image, and click **Use Selected Image**.
5. Set **Publishing & Status** (right sidebar):
   - **Publish on website**: Toggle **ON** to publish immediately on the website, or toggle **OFF** to save privately as a draft.
   - **Featured article**: Toggle **ON** if you want this article highlighted at the top of the blog page.
   - **Publication Date**: Defaults to today's date; adjust if backdating an article.
6. *(Optional)* **Preview Before Publishing**:
   - Click **Preview Article** at the top of the page to see how your article will look on the Panda Towers website before saving.
7. Click **Publish Now** (or **Save as Draft** at the top) to save your article.

---

## 3. Uploading & Managing Images

You can upload images in three ways:
1. **Featured Cover Image (Article Editor)**:
   - Drag and drop an image onto the **Featured Cover Image** box, or click **Upload File**.
   - Once uploaded, a live preview appears immediately. Hover over the preview to **Upload New**, choose from **Library**, or **Remove** (trash icon) the image.
2. **Inline Images Inside Article Content**:
   - Place your cursor where you want the image in the **Content Body** editor.
   - Click the **Image icon** in the editor toolbar and select an image from your computer. It will be uploaded and inserted automatically.
3. **Central Media Library (`/cms/media`)**:
   - Click **Media** in the left sidebar to upload, rename, set alt text, or delete media files across the CMS.

---

## 4. Editing an Existing Article

1. Go to **Blog** (`/cms/blog`) in the CMS sidebar.
2. Find the article using the search bar or category filter.
3. Click the **Article Title** or the **Pencil (Edit)** icon in the **Actions** column.
4. Update the title, content, cover image, author, category, or SEO fields as needed.
5. Click **Save & Update Article** (or **Update Published**) to apply your changes immediately.

---

## 5. Publishing & Unpublishing Articles

### Option A: One-Click Toggle from the Dashboard
- On `/cms/blog`, click the **Published** (green) or **Draft** (amber) badge in the **Status** column of any article:
  - Clicking **Draft** immediately publishes the article to the website.
  - Clicking **Published** immediately unpublishes the article and moves it to Drafts (hiding it from the public website without deleting it).
- You can also click the **Star** icon in the **Actions** column to feature or unfeature an article in one click.

### Option B: Bulk Publish / Unpublish
- Check the selection boxes next to multiple articles in the table.
- In the bulk action bar that appears at the top, click **Publish Selected** or **Move to Drafts**.

### Option C: Inside the Article Editor
- Open the article for editing, toggle **Publish on website** ON or OFF, or click **Save as Draft** / **Publish Now** in the top bar.

---

## 6. Deleting an Article

> **Tip**: If you only want to hide an article temporarily, **Unpublish** it instead of deleting it. Deletion is permanent.

1. On `/cms/blog`, click the red **Trash (Delete)** icon on the right side of the article row (or open the article and click **Delete This Article** at the bottom of the right sidebar).
2. A confirmation dialog will appear. If the article is currently **Published**, the dialog will warn you that deleting it removes it from the live website.
3. Click **Delete Article** to permanently remove it, or **Cancel** to keep it.
4. To delete multiple articles at once, select their checkboxes in the table and click **Delete Selected**.

---

## 7. Managing Blog Categories

1. On `/cms/blog`, click **Categories** in the top-right header (or go to `/cms/blog-categories`).
2. Click **Add Category**, enter a **Category Name**, choose a **Color Tag**, add an optional description, and click **Add Category**.
3. Use the **Pencil** icon to rename or recolor a category, or the **Trash** icon to delete it. Deleting a category does **not** delete its articles—they simply become *Uncategorized*.

