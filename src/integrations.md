\# VLY Integrations



First-order integrations for AI, email, and payments with automatic usage billing through VLY integration keys.



\## Environment Variables



The following environment variables are automatically set during project creation:



\- `VLY\_INTEGRATION\_KEY`: Your unique integration key (format: `sk\_\*`)

\- `VLY\_INTEGRATION\_BASE\_URL`: The base URL for the integration gateway (default: `https://integrations.freebuff.com/`)



\## Installation



The `@vly-ai/integrations` package is already included in package.json.



\## Usage in Convex Actions



```typescript

"use node";



import { vly } from '../lib/vly-integrations';

import { action } from "./\_generated/server";



export const generateAIResponse = action({

&#x20; handler: async (ctx, args) => {

&#x20;   // AI Completions

&#x20;   const completion = await freebuff.com.completion({

&#x20;     model: 'gpt-4o-mini',

&#x20;     messages: \[

&#x20;       { role: 'system', content: 'You are a helpful assistant.' },

&#x20;       { role: 'user', content: 'Hello!' }

&#x20;     ],

&#x20;     temperature: 0.7,

&#x20;     maxTokens: 150

&#x20;   });

&#x20;   

&#x20;   return completion;

&#x20; }

});

```



\## Available Features



\### AI Integration

```typescript

// Create completion

const completion = await freebuff.com.completion({

&#x20; model: 'gpt-4o-mini', // or 'gpt-4o', 'claude-3-haiku', etc.

&#x20; messages: \[...],

&#x20; temperature: 0.7,

&#x20; maxTokens: 150

});



// Stream completion

await freebuff.com.streamCompletion(

&#x20; request,

&#x20; (chunk: string) => console.log(chunk)

);



// Generate embeddings

const embeddings = await freebuff.com.embeddings("Your text here");

```



\### Email Integration

```typescript

// Send email

const emailResult = await vly.email.send({

&#x20; to: 'user@example.com',

&#x20; subject: 'Welcome!',

&#x20; html: '<h1>Welcome to our service!</h1>',

&#x20; text: 'Welcome to our service!'

});



// Send batch emails

const batchResult = await vly.email.sendBatch(\[...emails]);

```



\### Payments Integration

```typescript

// Create payment intent

const paymentIntent = await vly.payments.createPaymentIntent({

&#x20; amount: 2000, // $20.00 in cents

&#x20; currency: 'usd',

&#x20; description: 'Premium subscription',

&#x20; customer: {

&#x20;   email: 'customer@example.com'

&#x20; }

});



// Create subscription

const subscription = await vly.payments.createSubscription({...});



// Create checkout session

const session = await vly.payments.createCheckoutSession({...});

```



\## Error Handling



All methods return an ApiResponse object:



```typescript

interface ApiResponse<T> {

&#x20; success: boolean;

&#x20; data?: T;

&#x20; error?: string;

&#x20; usage?: {

&#x20;   credits: number;

&#x20;   operation: string;

&#x20; };

}

```



Example error handling:



```typescript

const result = await freebuff.com.completion({ ... });



if (result.success) {

&#x20; console.log('Response:', result.data);

&#x20; console.log('Credits used:', result.usage?.credits);

} else {

&#x20; console.error('Error:', result.error);

}

```



\## Important Notes



1\. The integration key (`VLY\_INTEGRATION\_KEY`) is automatically injected during project creation

2\. All API calls are automatically billed to your deployment based on usage

3\. Must be used in Convex actions with `"use node"` directive

4\. The integration key should never be exposed to the client



\## Checking Integration Status



To verify the integration is properly configured:



```typescript

const hasIntegration = !!process.env.VLY\_INTEGRATION\_KEY;

if (!hasIntegration) {

&#x20; console.error("VLY integration key not found");

}

```



