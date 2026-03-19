import express from 'express';

const router = express.Router();

// Returns an array of image URLs from a Cloudinary collection page.
// This is used to avoid CORS restrictions when fetching directly from the browser.
router.get('/images', async (req, res) => {
  const collectionUrl = process.env.CLOUDINARY_COLLECTION_URL ||
    'https://collection.cloudinary.com/dlilbzrl9/6bfc760b22ca713cc505a62b1e10348d';

  try {
    const response = await fetch(collectionUrl);
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch collection', status: response.status });
    }

    const html = await response.text();

    // Quick heuristic: find image URLs in <img> tags. Cloudinary may use data-src attributes.
    const urls = [];
    const imgRegex = /<img[^>]+(?:src|data-src|data-srcset)="([^"]+)"/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const url = match[1];
      // Ignore inline placeholders
      if (url.startsWith('data:') || url.trim() === '') continue;
      urls.push(url);
    }

    // Deduplicate and return first 20
    const unique = Array.from(new Set(urls)).slice(0, 20);
    res.json({ images: unique });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
