export type PhishingEmail = {
  id: number;
  from: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  explanation: string;
};

export const phishingEmails: PhishingEmail[] = [
  {
    id: 1,
    from: '"Netflix" <support@netflix-billing.com>',
    subject: "Action Required: Your Subscription is on Hold",
    body: `Dear User,\n\nWe were unable to process your last payment. To avoid interruption of service, please update your payment details by clicking the link below.\n\n[http://netflix-billing-update.com/login]\n\nThanks,\nThe Netflix Team`,
    isPhishing: true,
    explanation:
      "This is a phishing attempt. The sender's email address and the link domain are not official Netflix domains. The urgent tone is also a red flag.",
  },
  {
    id: 2,
    from: '"Your Bank" <security@your-bank.com>',
    subject: "Unusual Sign-in Attempt Detected",
    body: `Hi [Your Name],\n\nWe detected a sign-in to your account from an unrecognized device in a different country. If this wasn't you, please secure your account immediately by clicking here:\n\n[https://your-bank.com/secure/login?session=...]\n\nIf this was you, you can safely ignore this email.\n\nBest,\nYour Bank Security Team`,
    isPhishing: false,
    explanation:
      "This is a legitimate security alert. The link goes to the correct domain, the greeting is personalized, and it provides a way to ignore the alert if the activity was legitimate.",
  },
  {
    id: 3,
    from: '"HR Department" <hr@yourcompany.biz>',
    subject: "IMPORTANT: Annual Benefits Enrollment",
    body: `All employees,\n\nPlease find attached the new benefits enrollment form. You must complete and return it by the end of the week. The form requires your login credentials to verify your identity.\n\n[benefits-enrollment.pdf]\n\nThank you.`,
    isPhishing: true,
    explanation:
      "This is a phishing email. A real HR department would not ask for your login credentials in a PDF form. The generic greeting and unusual sender domain (.biz) are also suspicious.",
  },
  {
    id: 4,
    from: '"Google" <no-reply@accounts.google.com>',
    subject: "Security alert: New sign-in to your Google Account",
    body: `Your Google Account was just signed into from a new Windows device. You're getting this email to make sure it was you.\n\n[Check activity]\n\nIf you don't recognize this activity, you should change your password immediately.\n\nSincerely,\nThe Google Accounts team`,
    isPhishing: false,
    explanation:
      "This is a legitimate email from Google. The sender address is correct, and the 'Check activity' button would lead to the official Google account management page.",
  },
  {
    id: 5,
    from: '"Amazon Support" <support@ama-zon.com>',
    subject: "Order #123-4567890-1234567 has been cancelled",
    body: `Greetings,\n\nYour recent order has been cancelled because we could not verify your shipping address. Please click the link below to enter your address again.\n\n[http://ama-zon.com/verify-address]\n\nWe apologize for the inconvenience.`,
    isPhishing: true,
    explanation: "This is phishing. The domain 'ama-zon.com' uses a hyphen to mimic the real Amazon domain, a common trick called typosquatting.",
  },
  {
    id: 6,
    from: '"Dropbox" <no-reply@dropbox.com>',
    subject: "John Doe shared a file with you",
    body: `Hi there,\n\nJohn Doe has shared a file with you on Dropbox. You can view it by clicking the button below.\n\n[View "Q3_Report.docx"]\n\nHappy collaborating!`,
    isPhishing: false,
    explanation: "This is a legitimate notification from Dropbox. The sender address and links would point to the official Dropbox domain."
  },
  {
    id: 7,
    from: '"IT Help Desk" <helpdesk@mail-server1.com>',
    subject: "URGENT: Mailbox quota exceeded",
    body: `Your email account has exceeded its storage limit. You will be unable to send or receive messages shortly. To increase your quota, please log in here:\n\n[http://mail-quota-increase.com/login]\n\nIT Support`,
    isPhishing: true,
    explanation: "This is a classic phishing scam. The generic sender address, urgent tone, and unofficial link are all major red flags."
  },
  {
    id: 8,
    from: '"GitHub" <noreply@github.com>',
    subject: "[GitHub] A new public key was added to your account",
    body: `Hey [Your Username],\n\nA new SSH key was added to your GitHub account. \n\nKey: "My New Laptop"\n\nIf you did not add this key, please review your security settings and consider changing your password.\n\nThanks,\nThe GitHub Team`,
    isPhishing: false,
    explanation: "This is a legitimate security notification from GitHub. It informs you of a sensitive change and provides advice without asking you to click a suspicious link."
  },
  {
    id: 9,
    from: '"USPS" <shipping.update@usps-track.info>',
    subject: "Delivery Failure Notice for Your Package",
    body: `Dear Customer,\n\nWe were unable to deliver your package today because nobody was home. A redelivery fee is required.\n\nPlease schedule a new delivery time and pay the fee here:\n[http://usps-track.info/redelivery]\n\nTracking ID: 9400111206214898765432`,
    isPhishing: true,
    explanation:
      "This is phishing. The sender's domain 'usps-track.info' is not the official usps.com. Legitimate postal services do not typically charge redelivery fees via an email link.",
  },
  {
    id: 10,
    from: '"Microsoft Account Team" <account-security-noreply@accountprotection.microsoft.com>',
    subject: "Microsoft account password reset",
    body: `Hi [Your Name],\n\nWe received your request for a single-use code to use with your Microsoft account.\n\nYour single-use code is: 123456\n\nIf you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.\n\nThanks,\nThe Microsoft account team`,
    isPhishing: false,
    explanation:
      "This is a legitimate password reset email from Microsoft. The sender domain is correct, and it advises you to ignore it if you didn't request it, which is standard practice.",
  },
  {
    id: 11,
    from: '"Acme Corp Billing" <billing@acme-corp-invoices.com>',
    subject: "Your Invoice #INV-0451 is Overdue",
    body: `Hello,\n\nThis is a reminder that invoice #INV-0451 for $79.99 is now past due. Failure to pay within 24 hours will result in service suspension.\n\nPlease view and pay the invoice here: [View Invoice]\n\nRegards,\nAcme Corp Billing`,
    isPhishing: true,
    explanation:
      "This is a phishing attempt if you don't use 'Acme Corp'. It creates false urgency and uses a generic greeting. The link would lead to a malicious site to steal payment info.",
  },
  {
    id: 12,
    from: '"Apple" <no_reply@email.apple.com>',
    subject: "Your Apple ID was used to sign in to iCloud on a new device",
    body: `Dear Customer,\n\nYour Apple ID was used to sign in to iCloud from a web browser.\n\nDate and Time: [Current Date]\nBrowser: Chrome\nOS: Windows\n\nIf the information above looks familiar, you can disregard this email.\n\nIf you have not signed in to iCloud recently and believe someone may have accessed your account, you should reset your password at [appleid.apple.com].\n\nThe Apple Support Team`,
    isPhishing: false,
    explanation:
      "This is a legitimate security alert from Apple. It provides details about the sign-in and directs you to the official Apple ID website to take action, rather than using a suspicious link.",
  },
  {
    id: 13,
    from: '"International Lottery" <winner@eurolotto.org>',
    subject: "Congratulations! You have won!",
    body: `CONGRATULATIONS!\n\nYou have been selected as a winner of the International Online Lottery. Your prize is $1,500,000.\n\nTo claim your prize, you must contact our claims agent, Mr. John Smith, at claims.agent.john@gmail.com and provide your full name, address, and a copy of your ID.\n\nYou must also pay a processing fee of $500 to release the funds.\n\nSincerely,\nEuro Lotto`,
    isPhishing: true,
    explanation:
      "This is a classic advance-fee fraud scam. Unsolicited lottery winnings are always fake. They ask for personal information and a fee to 'release' a non-existent prize.",
  }
];
