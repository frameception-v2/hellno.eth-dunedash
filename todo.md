
Make a `todo.md` that I can use as a checklist for building this project.

Draft a detailed, step-by-step blueprint for building this project. Then, once you have a solid plan, break it down into small, iterative chunks that build on each other. Look at these chunks and then go another round to break it into small steps. review the results and make sure that the steps are small enough to be implemented safely, but big enough to move the project forward. Iterate until you feel that the steps are right sized for this project.
From here you should have the foundation to provide a series of prompts for a code-generation LLM that will implement each step. Prioritize best practices, and incremental progress, ensuring no big jumps in complexity at any stage. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step.
Make sure and separate each prompt section. Use markdown. Each prompt should be tagged as text using code tags. The goal is to output prompts, but context, etc is important as well.

Compile our findings into a comprehensive, developer-ready specification. 
Include all relevant requirements, architecture choices, data handling details, error handling strategies, so a developer can immediately begin implementation.
API context:
# fetch-user-balance

**Endpoint**: `GET /farcaster/user/balance`

## Description
Fetches the token balances of a user given their FID

## Parameters
- `fid` (query): FID of the user to fetch
- `networks` (query): Comma separated list of networks to fetch balances for. Currently, only "base" is supported.

## Response
```yaml
type: object
properties:
  user_balance:
    type: object
    required:
    - object
    - user
    - address_balances
    properties:
      object:
        type: string
        enum:
        - user_balance
      user:
        type: object
        required:
        - object
        - fid
        properties:
          object:
            type: string
            enum:
            - user_dehydrated
          fid:
            type: integer
            format: int32
            description: The unique identifier of a farcaster user (unsigned integer)
            examples:
            - 3
            - 191
            - 2
            - 194
            - 19960
          username:
            type: string
          display_name:
            type: string
          pfp_url:
            type: string
      address_balances:
        type: array
        items:
          type: object
          description: The token balances associated with a wallet address
          required:
          - object
          - verified_address
          - token_balances
          properties:
            object:
              type: string
              enum:
              - address_balance
            verified_address:
              type: object
              required:
              - address
              - network
              properties:
                address:
                  type: string
                  description: The wallet address
                network:
                  type: string
                  description: A blockchain network e.g. "base"
                  enum:
                  - base
            token_balances:
              type: array
              items:
                type: object
                description: The token balance associated with a wallet address and
                  a network
                required:
                - object
                - token
                - balance
                properties:
                  object:
                    type: string
                    enum:
                    - token_balance
                  token:
                    type: object
                    required:
                    - object
                    - name
                    - symbol
                    properties:
                      object:
                        type: string
                        enum:
                        - token
                      name:
                        type: string
                        description: The token name e.g. "Ethereum"
                      symbol:
                        type: string
                        description: The token symbol e.g. "ETH"
                      address:
                        type: string
                        description: The contract address of the token (omitted for
                          native token)
                      decimals:
                        type: integer
                        description: The number of decimals the token uses
                  balance:
                    type: object
                    required:
                    - in_token
                    - in_usdc
                    properties:
                      in_token:
                        type: string
                        description: The balance in the token
                      in_usdc:
                        type: string
                        description: The balance in USDC
```

# Dune Analytics API

Dune is a web-based platform that allows you to query public blockchain data and aggregate it into beautiful dashboards.

import { QueryParameter, DuneClient, RunQueryArgs } from "@duneanalytics/client-sdk";
const { DUNE_API_KEY } = process.env;

const client = new DuneClient(DUNE_API_KEY ?? "");
const queryId = 1215383;
const opts: RunQueryArgs = {
queryId,
query_parameters: [
QueryParameter.text("TextField", "Plain Text"),
QueryParameter.number("NumberField", 3.1415926535),
QueryParameter.date("DateField", "2022-05-04 00:00:00"),
QueryParameter.enum("ListField", "Option 1"),
],
};

client
.runQuery(opts)
.then((executionResult) => console.log(executionResult.result?.rows));

// should look like
// [
// {
// date_field: "2022-05-04 00:00:00.000",
// list_field: "Option 1",
// number_field: "3.1415926535",
// text_field: "Plain Text",
// },
// ]

# fetch-bulk-users-by-eth-or-sol-address

**Endpoint**: `GET /farcaster/user/bulk-by-address`

## Description
Fetches all users based on multiple Ethereum or Solana addresses.

Each farcaster user has a custody Ethereum address and optionally verified Ethereum or Solana addresses. This endpoint returns all users that have any of the given addresses as their custody or verified Ethereum or Solana addresses.

A custody address can be associated with only 1 farcaster user at a time but a verified address can be associated with multiple users.
You can pass in Ethereum and Solana addresses, comma separated, in the same request. The response will contain users associated with the given addresses.

## Parameters
- `addresses` (query): Comma separated list of Ethereum addresses, up to 350 at a time
- `address_types` (query): Customize which address types the request should search for. This is a comma-separated string that can include the following values: 'custody_address' and 'verified_address'. By default api returns both. To select multiple types, use a comma-separated list of these values.

- `viewer_fid` (query): No description

## Response
```yaml
type: object
additionalProperties:
  type: array
  items:
    $ref: '#/components/schemas/User'
```

- allOf:
                                - *id003
                                - type: object
                                  required:
                                  - type
                                  - url
                                  - width
                                  - height
                                  properties:
                                    type:
                                      type: string
                                      enum:
                                      - photo
                                    url:
                                      type:
                                      - string
                                      - 'null'
                                      description: The source URL of the image. Consumers
                                        should be able to insert this URL into an
                                        <img> element. Only HTTP and HTTPS URLs are
                                        valid.
                                    width:
                                      type:
                                      - number
                                      - 'null'
                                      description: The width in pixels of the image
                                        specified in the url parameter.
                                    height:
                                      type:
                                      - number
                                      - 'null'
                                      description: The height in pixels of the image
                                        specified in the url parameter.
                              - allOf:
                                - *id003
                                - type: object
                                  required:
                                  - type
                                  properties:
                                    type:
                                      type: string
                                      enum:
                                      - link
                              discriminator:
                                propertyName: type
                                mapping:
                                  rich: '#/components/schemas/OembedRichData'
                                  video: '#/components/schemas/OembedVideoData'
                                  photo: '#/components/schemas/OembedPhotoData'
                                  link: '#/components/schemas/OembedLinkData'
                      frame: &id010
                        discriminator:
                          propertyName: version
                        oneOf:
                        - description: Frame v1 object
                          allOf:
                          - &id004
                            description: Frame base object used across all versions
                            type: object
                            required:
                            - version
                            - image
                            - frames_url
                            properties:
                              version:
                                type: string
                                description: Version of the frame, 'next' for v2,
                                  'vNext' for v1
                              image:
                                type: string
                                description: URL of the image
                              frames_url:
                                type: string
                                description: Launch URL of the frame
                          - type: object
                            properties:
                              buttons:
                                type: array
                                items:
                                  type: object
                                  required:
                                  - index
                                  - action_type
                                  properties:
                                    title:
                                      type: string
                                      description: Title of the button
                                    index:
                                      type: integer
                                      description: Index of the button
                                    action_type:
                                      type: string
                                      description: The action type of a frame button.
                                        Action types "mint" & "link" are to be handled
                                        on the client side only and so they will produce
                                        a no/op for POST /farcaster/frame/action.
                                      enum:
                                      - post
                                      - post_redirect
                                      - tx
                                      - link
                                      - mint
                                    target:
                                      type: string
                                      description: Target of the button
                                    post_url:
                                      type: string
                                      description: Used specifically for the tx action
                                        type to post a successful transaction hash
                              post_url:
                                type: string
                                description: Post URL to take an action on this frame
                              title:
                                type: string
                              image_aspect_ratio:
                                type: string
                              input:
                                type: object
                                properties:
                                  text:
                                    type: string
                                    description: Input text for the frame
                              state:
                                type: object
                                properties:
                                  serialized:
                                    type: string
                                    description: State for the frame in a serialized
                                      format
                        - description: Frame v2 object
                          allOf:
                          - *id004
                          - type: object
                            required:
                            - title
                            - name
                            - icon
                            properties:
                              manifest:
                                type: object
                                properties:
                                  account_association:
                                    type: object
                                    properties:
                                      header:
                                        type: string
                                      payload:
                                        type: string
                                      signature:
                                        type: string
                                    required:
                                    - header
                                    - payload
                                    - signature
                                  frame:
                                    type: object
                                    properties:
                                      version:
                                        type: string
                                        enum:
                                        - 0.0.0
                                        - 0.0.

User prompt:
I have this dune query that I want to show in a Farcaster frame. I want to show the list of top users and also I want it to take the users address from Farcaster context that we get from frame sdk and check where the logged-in user is on the list based on wallet address
 
https://dune.com/queries/4666478?emoticon_t6c1ea=%F0%9F%A5%9C


