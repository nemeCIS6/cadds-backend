import NodeMailer from 'nodemailer';
import awaitReadyBase from '../common/awaitReadyBase';
const settings = require('../../settings')
const md5 = require('../../helpers/hashers').md5;
import Mail = require('nodemailer/lib/mailer');
import IExistingUser from '../../interfaces/account/IExistingUser';
import accountDatabase from '../db/accountDatabase';
import console = require('console');
class emailService extends awaitReadyBase {
    
    private _transport:Mail|undefined;
    constructor(){
        super();
        this._ready = false;
        this._createTransportAsync();
    }

    private _createTransportAsync(){
        this._transport = NodeMailer.createTransport(
            settings.smtp
        );
        this._ready = true;
    }

    public async sendConfirmationMailAsync(user:IExistingUser,code:string){

        if(!user.email){
            throw(`No email found for user ${user.id}`);
        }
      
        //TODO: 28/07/19 Rogier: should move body to somewhere else (probably database so can be edited in admin panel);
        try{
            const text = [
                `CADDS account activation`, 
                `Dear ${user.firstName} ,`,
                'Please find below your email confirmation code that is required to activate you Rubbiz account:',
                'Activation code: ' + code,
                'You can enter this code upon login in the Rubbiz app',
                'Kind regards,'
            ].join('\r\n\r\n');
            const html = [
                '<h1>CADDS account activation</h1>',
                `<p>Dear ${user.firstName},</p>`,
                '<p>Please find below your email confirmation code that is required to activate you Rubbiz account: </p>',
                '<p>Rubbiz activation Code: <strong>' + code + '</strong></p>',
                '<p>You can enter this code upon login in the Rubbiz app<br/>',
                '<p>Kind Regards,</p>',
                '<p><strong>CADDS</strong></p>'
            ].join('');
        
              
 
            let res = await this.sendAsync(
                "CADDS Account Activation",
                user.email,
                `${user.firstName} ${user.lastName}`,
                settings.email.default.from.address,
                settings.email.default.from.name,
                text,
                html  
            );         
            return res;
        }
        catch(e){
            console.error(e);
            throw({message:'unknown error'})
        }
        

    }

    async sendResetPasswordEmailAsync(user:IExistingUser,code:string, validUntil:Date){
        if(!user.email){
            throw(`No email found for user ${user.id}`);
        }
        const text = [
            `CADDS account activation`, 
            `Dear ${user.firstName} ,`,
            'You seem to have requested a password reset. If this was not you, please disregard this message.',
            'In order to reset your password, please use the following code:  ' + code,
            'You can enter this code in the forgot password form in the app.',
            `Note that this code is only valid until ${validUntil.toUTCString()} UTC`,
            'Kind regards,',
            'CADDS'
        ].join('\r\n\r\n');
        const html = [
            '<h1>CADDS: Password reset</h1>',
            `<p>Dear ${user.firstName},</p>`,
            '<p>You seem to have requested a password reset. If this was not you, please disregard this message.</p>',
            '<p>In order to reset your password, please use the following code: <strong>' + code + '</strong></p>',
            '<p>You can enter this code in the forgot password form in the app.<br/>',
            `<p>Note that this code is only valid until <strong>${validUntil.toUTCString()}</strong></p>`,
            '<p>Kind Regards,</p>',
            '<p><strong>CADDS</strong></p>'
        ].join('');

        let res = await this.sendAsync(
            "CADDS Password reset",
            user.email,
            `${user.firstName} ${user.lastName}`,
            settings.email.default.from.address,
            settings.email.default.from.name,
            text,
            html  
        );         
        return res;
    }

   public async sendAsync(subject:string,toEmail:string,toName:string,fromEmail:string,fromName:string,body:string, bodyHtml?:string){
        
        await this.ReadyAsync();
        if(!bodyHtml){
            bodyHtml = body;
        }
        const options = {
            from: {
                name : fromName,
                address: fromEmail
            },
            to: {
                name: toName,
                address: toEmail
            },
            subject,
            text:body,
            html: bodyHtml
        };
        return await this._sendMailAsync(options);
   }

   private async _sendMailAsync(mailOptions: Mail.Options){
  
    return new Promise((resolve,reject) => {
        if(!this._transport){
            return reject('no transporter'); //this will never happen as long as the parent method awaits readyAsync(), but intellisense does not know that.
        }
        this._transport.sendMail(mailOptions,(err,res) => {
            if(err){
                return reject(err);
            }
            else{
                return resolve(res);
            }
        });
    });
   }


}
export default new emailService();