/**
 * @swagger
 * tags:
 *   name: Circles
 *   description: Operations related to circles
 *
 *
 * /circle:
 *   get:
 *     tags: [Circles]
 *     summary: Get a list of circles
 *     description: Retrieve circles with optional sorting and limiting parameters
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Number of circles to retrieve (default is 10)
 *       - in: query
 *         name: sortedBy
 *         schema:
 *           type: string
 *           enum: [num-asc, num-desc, rating-asc, rating-desc]
 *           description: Sort circles by specified criteria
 *     responses:
 *       '200':
 *         description: Successful response. Returns a list of circles.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   description: Circle description
 *                   rating: 4.5
 *                   members: [...]
 *                   lead: {...}
 *                   colead: {...}
 *                   projects: [...]
 *                   _count: {...}
 *                   createdAt: "2022-02-03T12:34:56Z"
 *       '400':
 *         description: Bad request. Invalid parameters provided.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Invalid parameters provided"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Internal Server Error"
 *     security:
 *       - BearerAuth: []
 */
