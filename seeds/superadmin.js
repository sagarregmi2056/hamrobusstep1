// need to export owner model here 



require('dotenv').config();
exports.seedSuperAdmin = async () => {


    // yadi milxa vanya super admin ko id pw role 
    const email =process.env.SEMAIL
    const password =process.env.SPASSWORD
    const role = "superadmin"



    const ownerExists = await Owner.findOne({ email });
    if (ownerExists) return;



// yadi tyo xaina vanya new super admin khoja
    const newowner = new Owner({
        email,
        password,
        role,
        name: 'SAdmin',
        citizenshipNumber: '123',
        phone: 9999999999,
        isVerified: true
    });

    await newowner.save();
    console.warn("Superadmin seeded successfully...")
  };