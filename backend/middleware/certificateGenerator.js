import { jsPDF } from "jspdf";
import {certificateImage} from "../assets/certificateImage.js";

function generateCertificate(achieverName, courseTitle){

    let pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'letter',
        putOnlyUsedFonts:true,
        compress: true
    });

    let width = pdf.internal.pageSize.getWidth();
    let height = pdf.internal.pageSize.getHeight();

    pdf.addImage(certificateImage, "png", 0, 0, width, height);

    pdf.setFont(undefined, "bold");
    pdf.setFontSize(30);

    pdf.text(achieverName, width/2, 310, {maxWidth: width - 15, align: "center"});

    pdf.text(courseTitle, width/2, 400, {maxWidth: width - 15, align: "center"});
    
    return Buffer.from(pdf.output('arraybuffer'))
}

export default generateCertificate;