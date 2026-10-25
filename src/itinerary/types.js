/**
 * @file Types and Constants for WanderWise / Adeon Itinerary Data Model
 */

/**
 * @typedef {'nature' | 'sight' | 'restaurant' | 'cafe' | 'bar' | 'hotel' | 'museum' | 'activity'} PlaceCategory
 */

/**
 * @typedef {'transport' | 'accommodation' | 'food' | 'activities' | 'other'} ExpenseCategory
 */

/**
 * @typedef {'flight' | 'train' | 'bus' | 'car' | 'taxi' | 'bicycle' | 'cruise' | 'ferry' | 'other'} TransportType
 */

/**
 * @typedef {'confirmed' | 'pending' | 'cancelled'} TransportStatus
 */

/**
 * @typedef {'planned' | 'active' | 'completed' | 'archived'} TripStatus
 */

/**
 * @typedef {'none' | 'p1' | 'p2' | 'p3'} TodoPriority
 */

/**
 * @typedef {Object} Trip
 * @property {string} id - Stable UUID
 * @property {string} title - User-editable title
 * @property {string} destination - Trip destination text
 * @property {string} [description] - Trip description
 * @property {string} [coverImageUrl] - URL or local asset path
 * @property {string} startDate - YYYY-MM-DD
 * @property {string} endDate - YYYY-MM-DD
 * @property {string} currency - ISO 4217 code (e.g. 'JPY', 'USD')
 * @property {number} [budget] - Minor unit or standard unit integer
 * @property {string[]} [tags] - Tags / highlights
 * @property {TripStatus} status - Status
 * @property {string} createdAt - ISO 8601 timestamp
 * @property {string} updatedAt - ISO 8601 timestamp
 * @property {string} [seedId] - Identifier if originated from seed
 */

/**
 * @typedef {Object} Place
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {string} name - Place name
 * @property {PlaceCategory} category - Category
 * @property {string} [note] - User notes
 * @property {string} [tip] - Helpful tip
 * @property {string} [imageUrl] - Image URL or local asset
 * @property {number} [latitude] - Decimal degrees
 * @property {number} [longitude] - Decimal degrees
 * @property {number} [estimatedCost] - In trip currency unit
 * @property {boolean} [isFavorite] - Favorite toggle
 * @property {string} createdAt - ISO 8601 timestamp
 * @property {string} updatedAt - ISO 8601 timestamp
 */

/**
 * @typedef {Object} Day
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {string} date - YYYY-MM-DD
 * @property {string} [title] - Custom day title
 * @property {string} [dayNote] - Notes for the day
 * @property {string} [transportNote] - Transport notes
 * @property {string} [weatherIcon] - Icon name
 * @property {string} [weatherTemp] - Weather temp string
 */

/**
 * @typedef {Object} Visit
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {string} dayId - Foreign key -> Day.id
 * @property {string} placeId - Foreign key -> Place.id
 * @property {number} order - 0-indexed display order
 * @property {string} [scheduledTime] - HH:MM
 * @property {string} [notes] - Specific visit notes
 */

/**
 * @typedef {Object} Expense
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {string} name - Description of expense
 * @property {number} amount - Non-negative integer
 * @property {ExpenseCategory} category - Expense category
 * @property {string} [date] - YYYY-MM-DD
 * @property {number[]} [dayIndices] - Spread across day numbers
 * @property {string} [linkedTransportId] - FK -> TransportBooking.id
 * @property {string} [linkedShopEntryId] - FK -> ShopGuideEntry.id
 * @property {string} createdAt - ISO 8601 timestamp
 */

/**
 * @typedef {Object} TransportBooking
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {TransportType} type - Transport type
 * @property {TransportStatus} status - Booking status
 * @property {string} title - Title or route
 * @property {string} [confirmationCode] - Reference code
 * @property {string} [carrier] - Carrier name
 * @property {string} [from] - Origin
 * @property {string} [to] - Destination
 * @property {string} [flightNumber] - Flight number
 * @property {string} [seatNumber] - Seat
 * @property {string} [departureDate] - Departure ISO string
 * @property {string} [arrivalDate] - Arrival ISO string
 * @property {number} [price] - Booking cost
 * @property {string} [currency] - Currency code
 * @property {string} [notes] - Notes
 * @property {string} createdAt - ISO 8601 timestamp
 * @property {string} updatedAt - ISO 8601 timestamp
 */

/**
 * @typedef {Object} PackingItem
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {string} text - Item text
 * @property {string} [category] - Category name
 * @property {number} [quantity] - Default 1
 * @property {boolean} checked - Whether packed
 * @property {number} order - Order index
 * @property {string} createdAt - ISO 8601 timestamp
 */

/**
 * @typedef {Object} TodoItem
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {string} title - Task title
 * @property {string} [description] - Description
 * @property {boolean} done - Completed status
 * @property {TodoPriority} [priority] - Priority
 * @property {string} [dueDate] - YYYY-MM-DD
 * @property {number} order - Order index
 * @property {string} createdAt - ISO 8601 timestamp
 */

/**
 * @typedef {Object} FoodGuideEntry
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {string} name - Dish name
 * @property {string} [emoji] - Food emoji
 * @property {string} [tagLine] - Type and price range
 * @property {string} [story] - Cultural background
 * @property {string} [whereToFind] - Recommended spot
 * @property {string} [tip] - Practical advice
 * @property {string[]} [gradientColors] - 2 hex colors
 * @property {boolean} tried - Whether tried
 * @property {number} order - Order index
 */

/**
 * @typedef {Object} ShopGuideEntry
 * @property {string} id - UUID
 * @property {string} tripId - Foreign key -> Trip.id
 * @property {string} name - Item name
 * @property {string} [emoji] - Item emoji
 * @property {string} [tagLine] - Description/price
 * @property {string} [story] - What makes it special
 * @property {string} [whereToBuy] - Location/market
 * @property {string} [tip] - Practical shopping tip
 * @property {string[]} [gradientColors] - 2 hex colors
 * @property {boolean} bought - Whether bought
 * @property {string} [linkedExpenseId] - Link to Expense
 * @property {number} order - Order index
 */

/**
 * @typedef {Object} TripStore
 * @property {Trip} trip
 * @property {Place[]} places
 * @property {Day[]} days
 * @property {Visit[]} visits
 * @property {Expense[]} expenses
 * @property {TransportBooking[]} transports
 * @property {PackingItem[]} packingItems
 * @property {TodoItem[]} todoItems
 * @property {FoodGuideEntry[]} foodGuide
 * @property {ShopGuideEntry[]} shopGuide
 */

export const PLACE_CATEGORIES = /** @type {const} */ ([
  'nature',
  'sight',
  'restaurant',
  'cafe',
  'bar',
  'hotel',
  'museum',
  'activity',
])

export const EXPENSE_CATEGORIES = /** @type {const} */ ([
  'transport',
  'accommodation',
  'food',
  'activities',
  'other',
])

export const TRANSPORT_TYPES = /** @type {const} */ ([
  'flight',
  'train',
  'bus',
  'car',
  'taxi',
  'bicycle',
  'cruise',
  'ferry',
  'other',
])

export const TRIP_STATUSES = /** @type {const} */ ([
  'planned',
  'active',
  'completed',
  'archived',
])
