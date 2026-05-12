import { toast } from '../hooks/useToast';

export const downloadFile = async (url: string, fileName: string) => {
  try {
    toast.info(`Начинаем скачивание: ${fileName}`);
    
    // For simple downloads, we can try to use a direct link first if it's same-origin
    // to avoid loading everything into memory (Blob).
    // But since we want custom naming and potentially sharing, we'll keep the fetch
    // but add a fallback.
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    
    let mimeType = blob.type;
    if (fileName.endsWith('.epub')) mimeType = 'application/epub+zip';
    if (fileName.endsWith('.fb2')) mimeType = 'application/xml';
    if (fileName.endsWith('.pdf')) mimeType = 'application/pdf';

    // Desktop/Fallback: Direct download via blob URL
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Short delay before cleanup to ensure trigger
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 100);

    toast.success('Файл успешно сохранен');

    // Attempt to use Web Share API as a bonus on mobile (only if supported and user might want it)
    // We do this AFTER the direct download attempt to ensure the file actually downloads.
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], fileName, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        try {
          // Some browsers might show a prompt here.
          // We don't await this because success was already reported for the download.
          navigator.share({
            files: [file],
            title: fileName,
          }).catch(e => console.log('Share dismissed or failed', e));
        } catch (error) {
          console.log('Share initiation failed', error);
        }
      }
    }
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Не удалось скачать книгу. Проверьте соединение и попробуйте снова.');
  }
};
