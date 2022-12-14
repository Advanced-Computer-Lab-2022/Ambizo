import cron from "node-cron";
import nodemailer from "nodemailer";
import fs from "fs";
import corporateTrainee from "../models/corporateTrainee.model.js";
import individualTrainee from "../models/individualTrainee.model.js";
import user from "../models/user.model.js";

let everyTwelveHours = '0 */12 * * *';
let everyMinute = '* * * * *';
let mailCertificates = cron.schedule(everyTwelveHours, () => {
    fs.readdir("./temp", (err, files) => {
        if(err){
            console.log(err);
        }
        files.forEach(async file => {
            try{
                let username = file.substring(0,file.length-4);
                let User = await user.findOne({Username: username});
                let Email ="";
                switch(User.Type){
                    case "corporateTrainee": 
                        User = await corporateTrainee.findOne({Username: username});
                        break;
                    case "individualTrainee": 
                        User = await individualTrainee.findOne({Username: username});
                        break;
                    default:
                        console.log('Failed in finding user email.')
                }
                Email = User.Email;
            
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: process.env.BUSINESS_EMAIL,
                      pass: process.env.BUSINESS_EMAIL_PASSWORD
                    }
                });

                var mailOptions = {
                    from: process.env.BUSINESS_EMAIL.toString(),
                    to: Email,
                    subject: 'Course Certificate',
                    html: `<h1>Hi ${User.Name},</h1><p>Congratulations on completing the course!</p><p>Kindly find the certificate attached below</p><p>You can now also download the certificate from the website</p>`,
                    attachments: [{
                        filename: file,
                        path: './temp/'+file,
                        contentType: 'application/pdf'
                      }]
                }
                transporter.sendMail(mailOptions)
                .then(() => {
                    fs.unlink('./temp/'+file, (err) => {
                        if(err){
                            console.log(err);
                        }
                    });
                })
                .catch(error => {
                    console.log(error);
                });
            }
            catch(err){
                console.log(err);
            }
        })
    });
})

export default mailCertificates;
