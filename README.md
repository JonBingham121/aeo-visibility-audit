# AEO Visibility Audit - Sales Page

## What's Included

1. **index.html** - Complete sales page with modern design, responsive layout
2. **VSL-SCRIPT.md** - Full video sales letter script (3-4 min + 60-second version)
3. **vercel.json** - Vercel deployment configuration

## Quick Edits Needed Before Launch

### 1. Payment Link (REQUIRED)
In `index.html`, find and replace this line (appears twice):
```html
<a href="https://buy.stripe.com/your-payment-link" class="cta-button">Get My Audit Now</a>
```

Replace with your actual Stripe payment link, MintBird checkout, or order form.

### 2. Video Embed (REQUIRED)
Find this section in `index.html`:
```html
<div class="video-placeholder" id="videoPlaceholder">
    [VSL Video Will Be Embedded Here]
</div>
```

Replace with your video embed code. Examples:

**YouTube:**
```html
<iframe width="100%" height="100%" src="https://www.youtube.com/embed/YOUR-VIDEO-ID" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

**Vimeo:**
```html
<iframe src="https://player.vimeo.com/video/YOUR-VIDEO-ID" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
```

**Wistia:**
```html
<iframe src="https://fast.wistia.net/embed/iframe/YOUR-VIDEO-ID" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
```

### 3. Optional Customizations

**Change colors:**
- Primary gradient: Search for `#667eea` and `#764ba2`
- Green CTA: Search for `#10b981`
- Update to match your brand

**Add tracking:**
Add before closing `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>

<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

**Add live chat:**
Add Intercom, Drift, or Tawk.to widget code before closing `</body>`.

## Deployment

This page is ready to deploy to Vercel. The deployment configuration is already set up in `vercel.json`.

## File Structure

```
aeo-audit-sales/
├── index.html          # Sales page
├── VSL-SCRIPT.md       # Video script
├── vercel.json         # Vercel config
└── README.md           # This file
```

## Next Steps After Deployment

1. ✅ Record VSL using the script
2. ✅ Upload video to YouTube/Vimeo/Wistia
3. ✅ Add video embed to page
4. ✅ Set up Stripe payment link (or MintBird/ThriveCart)
5. ✅ Add payment link to CTA buttons
6. ✅ Test checkout flow
7. ✅ Add analytics tracking
8. ✅ Launch ads or organic traffic

## Support

For questions or customization help, reach out to Jon Bingham.
