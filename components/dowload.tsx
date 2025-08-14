 
'use client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileText } from 'lucide-react';

type Props = {
  text: string;
};

function Download({ text  }: Props) {
  const downloadReceipt = () => {
    const element = document.getElementById('receipt');
    if (!element) return;

    // element.style.color = '#626262';
 
    
    html2canvas(element, {
      scale: 2,
      width: element.scrollWidth,
      height: element.scrollHeight,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'pt', 'a4');

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate scale factor to fit within page without stretching
      const scale = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);

      const imgWidth = canvasWidth * scale;
      const imgHeight = canvasHeight * scale;

      // Center image
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

      doc.save(`${text}.pdf`);
      // element.style.color = '#E2E2F4'; 
    });
  };

  return (
    <div className='flex justify-end'>
      <button
        onClick={downloadReceipt}
        className="mt-4 px-6 py-3 buttonbg max-md:text-sm max-md:px-3 max-md:py-1 text-white flex items-center gap-3 rounded-lg"
      >
        Download <FileText />
      </button>
    </div>
  );
}

export default Download;
