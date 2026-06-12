"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.getFavorites = exports.toggleFavorite = exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.getProperties = exports.createProperty = void 0;
const db_1 = require("../config/db");
const createProperty = async (req, res) => {
    try {
        const ownerId = req.user?.userId;
        const { title, description, price, type, purpose, city, area, address, latitude, longitude, areaSize, areaUnit, bedrooms, bathrooms, parking, amenities, videoUrl, images, } = req.body;
        if (!title || !price || !type || !purpose || !city || !area || !address || !areaSize) {
            return res.status(400).json({ error: 'All core property details are required.' });
        }
        const listingStatus = req.user?.role === 'ADMIN' ? 'ACTIVE' : 'PENDING_VERIFICATION';
        const property = await db_1.prisma.property.create({
            data: {
                ownerId: ownerId,
                title,
                description: description || '',
                price,
                type,
                purpose,
                status: listingStatus,
                city,
                area,
                address,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                areaSize: parseFloat(areaSize),
                areaUnit: areaUnit || 'MARLA',
                bedrooms: bedrooms ? parseInt(bedrooms) : null,
                bathrooms: bathrooms ? parseInt(bathrooms) : null,
                parking: parking ? parseInt(parking) : 0,
                amenities: amenities || [],
                videoUrl: videoUrl || null,
                images: {
                    create: images && Array.isArray(images) ? images.map((url) => ({ url })) : [],
                },
            },
            include: {
                images: true,
                owner: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        res.status(201).json({
            message: 'Property listing created successfully.',
            property,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.createProperty = createProperty;
const getProperties = async (req, res) => {
    try {
        const { city, type, purpose, minPrice, maxPrice, bedrooms, bathrooms, minAreaSize, maxAreaSize, verified, search, } = req.query;
        const filters = {};
        if (city)
            filters.city = { equals: String(city), mode: 'insensitive' };
        if (type)
            filters.type = String(type);
        if (purpose)
            filters.purpose = String(purpose);
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice)
                filters.price.gte = parseFloat(String(minPrice));
            if (maxPrice)
                filters.price.lte = parseFloat(String(maxPrice));
        }
        if (bedrooms)
            filters.bedrooms = parseInt(String(bedrooms));
        if (bathrooms)
            filters.bathrooms = parseInt(String(bathrooms));
        if (minAreaSize || maxAreaSize) {
            filters.areaSize = {};
            if (minAreaSize)
                filters.areaSize.gte = parseFloat(String(minAreaSize));
            if (maxAreaSize)
                filters.areaSize.lte = parseFloat(String(maxAreaSize));
        }
        if (verified === 'true') {
            filters.status = 'ACTIVE';
        }
        if (search) {
            filters.OR = [
                { title: { contains: String(search), mode: 'insensitive' } },
                { description: { contains: String(search), mode: 'insensitive' } },
                { area: { contains: String(search), mode: 'insensitive' } },
                { city: { contains: String(search), mode: 'insensitive' } },
            ];
        }
        const properties = await db_1.prisma.property.findMany({
            where: filters,
            include: {
                images: true,
                owner: {
                    include: {
                        profile: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ properties });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getProperties = getProperties;
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await db_1.prisma.property.findUnique({
            where: { id },
            include: {
                images: true,
                owner: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
        if (!property) {
            return res.status(404).json({ error: 'Property not found.' });
        }
        // Increment view count
        await db_1.prisma.property.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        res.status(200).json({ property });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getPropertyById = getPropertyById;
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user?.userId;
        const property = await db_1.prisma.property.findUnique({ where: { id } });
        if (!property) {
            return res.status(404).json({ error: 'Property not found.' });
        }
        if (property.ownerId !== ownerId && req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to edit this property.' });
        }
        const { title, description, price, type, purpose, city, area, address, latitude, longitude, areaSize, areaUnit, bedrooms, bathrooms, parking, amenities, videoUrl, images, } = req.body;
        const updatedProperty = await db_1.prisma.property.update({
            where: { id },
            data: {
                title,
                description,
                price,
                type,
                purpose,
                city,
                area,
                address,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                areaSize: areaSize ? parseFloat(areaSize) : undefined,
                areaUnit,
                bedrooms: bedrooms ? parseInt(bedrooms) : null,
                bathrooms: bathrooms ? parseInt(bathrooms) : null,
                parking: parking ? parseInt(parking) : 0,
                amenities,
                videoUrl,
            },
            include: {
                images: true,
            },
        });
        // If new images provided, sync them
        if (images && Array.isArray(images)) {
            await db_1.prisma.propertyImage.deleteMany({ where: { propertyId: id } });
            await db_1.prisma.propertyImage.createMany({
                data: images.map((url) => ({ propertyId: id, url })),
            });
        }
        res.status(200).json({
            message: 'Property updated successfully.',
            property: updatedProperty,
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerId = req.user?.userId;
        const property = await db_1.prisma.property.findUnique({ where: { id } });
        if (!property) {
            return res.status(404).json({ error: 'Property not found.' });
        }
        if (property.ownerId !== ownerId && req.user?.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to delete this property.' });
        }
        await db_1.prisma.property.delete({ where: { id } });
        res.status(200).json({ message: 'Property deleted successfully.' });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.deleteProperty = deleteProperty;
const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { propertyId } = req.body;
        if (!propertyId) {
            return res.status(400).json({ error: 'Property ID is required.' });
        }
        const existingFavorite = await db_1.prisma.favorite.findUnique({
            where: {
                userId_propertyId: { userId: userId, propertyId },
            },
        });
        if (existingFavorite) {
            await db_1.prisma.favorite.delete({
                where: {
                    userId_propertyId: { userId: userId, propertyId },
                },
            });
            return res.status(200).json({ isFavorite: false, message: 'Removed from favorites.' });
        }
        else {
            await db_1.prisma.favorite.create({
                data: {
                    userId: userId,
                    propertyId,
                },
            });
            return res.status(200).json({ isFavorite: true, message: 'Added to favorites.' });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.toggleFavorite = toggleFavorite;
const getFavorites = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const favorites = await db_1.prisma.favorite.findMany({
            where: { userId },
            include: {
                property: {
                    include: {
                        images: true,
                        owner: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json({ favorites: favorites.map((fav) => fav.property) });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getFavorites = getFavorites;
const getRecommendations = async (req, res) => {
    try {
        const userId = req.user?.userId;
        // Simple AI property recommendations based on user favorites or general active listings
        let favoriteCities = [];
        let favoriteTypes = [];
        if (userId) {
            const userFavs = await db_1.prisma.favorite.findMany({
                where: { userId },
                include: { property: true },
            });
            favoriteCities = userFavs.map((f) => f.property.city);
            favoriteTypes = userFavs.map((f) => f.property.type);
        }
        // Default Fallbacks
        if (favoriteCities.length === 0)
            favoriteCities = ['Islamabad', 'Lahore', 'Karachi'];
        if (favoriteTypes.length === 0)
            favoriteTypes = ['HOUSE', 'APARTMENT'];
        const recommendations = await db_1.prisma.property.findMany({
            where: {
                status: 'ACTIVE',
                OR: [
                    { city: { in: favoriteCities } },
                    { type: { in: favoriteTypes } },
                ],
            },
            include: {
                images: true,
                owner: {
                    include: {
                        profile: true,
                    },
                },
            },
            take: 6,
        });
        res.status(200).json({ recommendations });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};
exports.getRecommendations = getRecommendations;
