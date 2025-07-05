import download from "downloadjs";
import { toBlob } from "html-to-image";

export const downloadUi = async (id) => {
  const el = document.getElementById(id);
  if (!el) return;

  const originalBg = el.style.backgroundColor;
  el.style.backgroundColor = "#ffffff";

  try {
    const blob = await toBlob(el, {
      cacheBust: true,
      pixelRatio: 1.2,
    });

    if (blob) {
      download(blob, "dashboard.png");
    }
  } catch (err) {
    console.error("Download failed:", err);
  } finally {
    el.style.backgroundColor = originalBg;
  }
};
