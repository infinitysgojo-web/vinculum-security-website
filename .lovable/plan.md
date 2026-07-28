# Add Harvard Dataverse link

## Verified current state
- `src/components/ScholarlyLinks.tsx` renders a single wrapping row of five pill links (ORCID, Zenodo, Figshare, OSF, Portfolio) as inline SVG marks + labels.
- `src/components/SiteFooter.tsx` uses `<ScholarlyLinks variant="footer" />` in the license band.
- `src/pages/About.tsx` currently only points readers to the footer for profile links; it does not import or render `<ScholarlyLinks>`.

## Changes

1. **Add a Harvard Dataverse entry in `src/components/ScholarlyLinks.tsx`**
   - Create a `DataverseMark` inline SVG component (monochrome, `currentColor`, `aria-hidden`, same `w-3.5 h-3.5` icon class as the other marks).
   - Append `{ label: "Dataverse", href: "https://dataverse.harvard.edu/dataverse/viculumsecurity", Icon: DataverseMark }` to the `LINKS` array.
   - Keep the existing `me noopener noreferrer` rel, accessible label, and pill styling so the new link matches the others.

2. **Reflect the expanded link set in `src/pages/About.tsx` (optional but consistent)**
   - The user asked to add the link "as the others have been done". Because the About page currently only references the footer rather than rendering the row, the plan does not change the About page unless the user wants the row duplicated there. If desired, import `ScholarlyLinks` and replace the "available in the site footer below" paragraph with `<ScholarlyLinks variant="page" className="mt-2" />`.

## Verification
- Build the project and confirm no TypeScript errors.
- Check the footer and (if updated) About page to verify the Dataverse pill appears, uses the correct URL, and wraps cleanly on mobile.