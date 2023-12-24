const { requireSuperadminSignin } = require("../controllers/auth-owner");

const { postcuponDiscount } = require("../controllers/discountCupon");

const router = express.Router();

router.post("/addcoupon", requireSuperadminSignin, postcuponDiscount);

module.exports = router;
