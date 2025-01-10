import userRepository from '../repositories/userRepository.js';
import { findUserByEmail } from './authService.js';
import prisma from '../config/prisma.js';

async function getAllUsers() {
  return userRepository.getAll();
}

async function createUser() {
  return userRepository.create();
}

export const findAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickName: true,
      },
    });

    return users;
  } catch (error) {
    console.error('Error fetching all users:', error.message);
    throw new Error('Failed to fetch users');
  }
};


async function getProfile(email) {
  const data = await findUserByEmail(email);
  if(!data) {
    const error = new Error('User not found');
    error.statusCode = 404; 
    throw error;
  }
  const user = {
    email: data.email,
    nickName: data.nickName,
    points: data.points,
  }
  return user;
}

export default {
  createUser,
  getAllUsers,
  getProfile,
  findAllUsers,
};
