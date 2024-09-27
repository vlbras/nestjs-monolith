import express from 'express';
import bodyParser from 'body-parser';
import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor';

import {
  Keypair,
  PublicKey,
  Connection
} from '@solana/web3.js';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import {
  getOffers,
  getOpenPositions,
  getClosedPositions,
  getLiquidatedPositions,
  getAllPositions,
  openTrade,
  closeTrade,
  IDL
} from 'lavarage-sdk';

const app = express();

app.use(bodyParser.json());

function initProgram(): Program<typeof IDL> {
    const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/yTBaNPPya9CJDsgBHq-dg89gpjzbFzbQ', {
        wsEndpoint: 'wss://solana-mainnet.core.chainstack.com/ws/8cde996495659fabe0b76a1eb576a995',
        commitment: 'confirmed',
    })

    const wallet = new Wallet(Keypair.generate())

    const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'finalized',
    })

    return new Program(IDL, 'CRSeeBqjDnm3UPefJ9gxrtngTsnQRhEJiTA345Q83X3v', provider)
}

const lavarageProgram = initProgram()

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
  apis: ['./src/server.ts', './dist/server.js'],
};

const swaggerSpec = swaggerJsDoc(options);

app.use('/api/sdk/v0.1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.get('/api/sdk/v0.1/offers', async (req, res) => {
  try {
    const offers = await getOffers(lavarageProgram);
    res.json(offers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
app.get('/api/sdk/v0.1/positions/open', async (req, res) => {
  try {
    const positions = await getOpenPositions(lavarageProgram);
    res.json(positions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
app.get('/api/sdk/v0.1/positions/closed', async (req, res) => {
  try {
    const positions = await getClosedPositions(lavarageProgram);
    res.json(positions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
app.get('/api/sdk/v0.1/positions/liquidated', async (req, res) => {
  try {
    const positions = await getLiquidatedPositions(lavarageProgram);
    res.json(positions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
app.get('/api/sdk/v0.1/positions', async (req, res) => {
  try {
    const positions = await getAllPositions(lavarageProgram);
    res.json(positions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
app.post('/api/sdk/v0.1/trades/open', async (req, res) => {
  const { offerId, jupInstruction, marginSOL, leverage, partnerFeeRecipient } = req.body;
  try {
    const offer = (await getOffers(lavarageProgram)).find(o => offerId === o.publicKey.toBase58())

    if (!offer) {
        throw new Error('No offer found with pubkey ' + offerId)
    }

    const randomSeed = Keypair.generate();

    const tx = await openTrade(
      lavarageProgram,
      offer,
      jupInstruction,
      new BN(marginSOL),
      leverage,
      randomSeed,
      partnerFeeRecipient ? new PublicKey(partnerFeeRecipient) : undefined
    );
    res.json({ transaction: tx });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
app.post('/api/sdk/v0.1/trades/close', async (req, res) => {
  const { positionId, offerId, jupInstruction, partnerFeeRecipient, profitFeeMarkup } = req.body;
  try {
    const position = (await getAllPositions(lavarageProgram)).find(p => positionId === p.publicKey.toBase58())

    if (!position) {
        throw new Error('No position found with pubkey ' + positionId)
    }

    const offer = (await getOffers(lavarageProgram)).find(o => offerId === o.publicKey.toBase58())

    if (!offer) {
        throw new Error('No offer found with pubkey ' + offerId)
    }

    const tx = await closeTrade(
      lavarageProgram,
      position,
      offer,
      jupInstruction,
      partnerFeeRecipient ? new PublicKey(partnerFeeRecipient) : undefined,
      profitFeeMarkup
    );
    res.json({ transaction: tx });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
