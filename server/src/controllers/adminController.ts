import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProperties = await prisma.property.count();
    const activeListings = await prisma.property.count({ where: { status: 'ACTIVE' } });
    const pendingListings = await prisma.property.count({ where: { status: 'PENDING_VERIFICATION' } });

    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: {
        amount: true,
      },
    });

    const pendingVerifications = await prisma.verification.count({ where: { status: 'PENDING' } });

    res.status(200).json({
      totalUsers,
      totalProperties,
      activeListings,
      pendingListings,
      revenue: totalRevenue._sum.amount || 0,
      pendingVerifications,
      monthlyGrowth: 18.5, // Mock monthly growth percentage
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const getPendingListings = async (req: AuthRequest, res: Response) => {
  try {
    const listings = await prisma.property.findMany({
      where: { status: 'PENDING_VERIFICATION' },
      include: {
        images: true,
        owner: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ listings });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const approveListing = async (req: AuthRequest, res: Response) => {
  try {
    const { propertyId } = req.params;
    const { status } = req.body; // ACTIVE or REJECTED

    if (!['ACTIVE', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be ACTIVE or REJECTED.' });
    }

    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: { status },
    });

    res.status(200).json({
      message: `Property listing status updated to ${status}.`,
      property: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const getPendingVerifications = async (req: AuthRequest, res: Response) => {
  try {
    const verifications = await prisma.verification.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ verifications });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

export const approveUserVerification = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // Verification ID
    const { status, rejectionReason } = req.body; // VERIFIED or REJECTED

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status must be VERIFIED or REJECTED.' });
    }

    const verification = await prisma.verification.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
    });

    if (status === 'VERIFIED') {
      await prisma.profile.update({
        where: { userId: verification.userId },
        data: { isVerified: true },
      });
    }

    res.status(200).json({
      message: `Verification request ${status.toLowerCase()} successfully.`,
      verification,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
