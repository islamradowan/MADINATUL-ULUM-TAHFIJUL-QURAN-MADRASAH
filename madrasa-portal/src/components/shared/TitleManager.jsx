import usePageTitle from '../../hooks/usePageTitle';

/** Renders nothing — only manages document.title as a side-effect. */
export default function TitleManager() {
  usePageTitle();
  return null;
}
