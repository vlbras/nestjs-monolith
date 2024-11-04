"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const lavarage_sdk_1 = require("lavarage-sdk");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
function initProgram() {
    const connection = new web3_js_1.Connection('https://solana-mainnet.g.alchemy.com/v2/yTBaNPPya9CJDsgBHq-dg89gpjzbFzbQ', {
        wsEndpoint: 'wss://solana-mainnet.core.chainstack.com/ws/8cde996495659fabe0b76a1eb576a995',
        commitment: 'confirmed',
    });
    const wallet = new anchor_1.Wallet(web3_js_1.Keypair.generate());
    const provider = new anchor_1.AnchorProvider(connection, wallet, {
        preflightCommitment: 'finalized',
    });
    return new anchor_1.Program(lavarage_sdk_1.IDL, 'CRSeeBqjDnm3UPefJ9gxrtngTsnQRhEJiTA345Q83X3v', provider);
}
const lavarageProgram = initProgram();

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Lavarage API',
        version: '1.0.0',
        description: 'API documentation for Lavarage SDK methods',
    },
    servers: [
        {
            url: 'https://partner-api.lavarave.wtf',
        },
    ],
};
const options = {
    swaggerDefinition,
    apis: [path_1.default.join(__dirname, './src/server.ts'), path_1.default.join(__dirname, './server.js')],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
app.use('/api/sdk/v0.1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
/**
 * @swagger
 * /api/sdk/v0.1/offers:
 *   get:
 *     summary: Get all offers
 *     responses:
 *       200:
 *         description: A list of offers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/api/sdk/v0.1/offers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offers = yield (0, lavarage_sdk_1.getOffers)(lavarageProgram);
        res.json(offers);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
/**
 * @swagger
 * /api/sdk/v0.1/positions/open:
 *   get:
 *     summary: Get open positions
 *     responses:
 *       200:
 *         description: A list of open positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/api/sdk/v0.1/positions/open', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield (0, lavarage_sdk_1.getOpenPositions)(lavarageProgram);
        res.json(positions);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
/**
 * @swagger
 * /api/sdk/v0.1/positions/closed:
 *   get:
 *     summary: Get closed positions
 *     responses:
 *       200:
 *         description: A list of closed positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/api/sdk/v0.1/positions/closed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield (0, lavarage_sdk_1.getClosedPositions)(lavarageProgram);
        res.json(positions);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
/**
 * @swagger
 * /api/sdk/v0.1/positions/liquidated:
 *   get:
 *     summary: Get liquidated positions
 *     responses:
 *       200:
 *         description: A list of liquidated positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/api/sdk/v0.1/positions/liquidated', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield (0, lavarage_sdk_1.getLiquidatedPositions)(lavarageProgram);
        res.json(positions);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
/**
 * @swagger
 * /api/sdk/v0.1/positions:
 *   get:
 *     summary: Get all positions
 *     responses:
 *       200:
 *         description: A list of all positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/api/sdk/v0.1/positions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield (0, lavarage_sdk_1.getAllPositions)(lavarageProgram);
        res.json(positions);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
/**
 * @swagger
 * /api/sdk/v0.1/trades/open:
 *   post:
 *     summary: Open a trade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offerId:
 *                 type: string
 *               jupInstruction:
 *                 type: object
 *               marginSOL:
 *                 type: string
 *               leverage:
 *                 type: number
 *               partnerFeeRecipient:
 *                 type: string
 *     responses:
 *       200:
 *         description: The opened trade transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.get('/api/sdk/v0.2/positions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const positions = yield (0, lavarage_sdk_1.getAllPositions)(lavarageProgram);
        res.json(positions);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
/**
 * @swagger
 * /api/sdk/v0.1/trades/open:
 *   post:
 *     summary: Open a trade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offerId:
 *                 type: string
 *               jupInstruction:
 *                 type: object
 *               marginSOL:
 *                 type: string
 *               leverage:
 *                 type: number
 *               partnerFeeRecipient:
 *                 type: string
 *     responses:
 *       200:
 *         description: The opened trade transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.post('/api/sdk/v0.1/trades/open', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { offerId, jupInstruction, marginSOL, leverage, partnerFeeRecipient } = req.body;
    try {
        const offer = (yield (0, lavarage_sdk_1.getOffers)(lavarageProgram)).find(o => offerId === o.publicKey.toBase58());
        if (!offer) {
            throw new Error('No offer found with pubkey ' + offerId);
        }
        const randomSeed = web3_js_1.Keypair.generate();
        const tx = yield (0, lavarage_sdk_1.openTrade)(lavarageProgram, offer, jupInstruction, new anchor_1.BN(marginSOL), leverage, randomSeed, partnerFeeRecipient ? new web3_js_1.PublicKey(partnerFeeRecipient) : undefined);
        res.json({ transaction: tx });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
/**
 * @swagger
 * /api/sdk/v0.1/trades/close:
 *   post:
 *     summary: Close a trade
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               positionId:
 *                 type: string
 *               offerId:
 *                 type: string
 *               jupInstruction:
 *                 type: object
 *               partnerFeeRecipient:
 *                 type: string
 *               profitFeeMarkup:
 *                 type: number
 *     responses:
 *       200:
 *         description: The closed trade transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.post('/api/sdk/v0.1/trades/close', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { positionId, offerId, jupInstruction, partnerFeeRecipient, profitFeeMarkup } = req.body;
    try {
        const position = (yield (0, lavarage_sdk_1.getAllPositions)(lavarageProgram)).find(p => positionId === p.publicKey.toBase58());
        if (!position) {
            throw new Error('No position found with pubkey ' + positionId);
        }
        const offer = (yield (0, lavarage_sdk_1.getOffers)(lavarageProgram)).find(o => offerId === o.publicKey.toBase58());
        if (!offer) {
            throw new Error('No offer found with pubkey ' + offerId);
        }
        const tx = yield (0, lavarage_sdk_1.closeTrade)(lavarageProgram, position, offer, jupInstruction, partnerFeeRecipient ? new web3_js_1.PublicKey(partnerFeeRecipient) : undefined, profitFeeMarkup);
        res.json({ transaction: tx });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
