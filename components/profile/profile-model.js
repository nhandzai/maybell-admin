const fs = require('fs').promises;
const path = require('path');
const { prisma } = require('../../config/config');

const { uploadFile, deleteFile } = require('../cloudinary/cloudinary.js');


async function getAccountDetailById(id) {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID provided: ${id}`);
    }

    const account = await prisma.users.findUnique({
      where: { id: numericId }
    });

    if (!account) {
      throw new Error(`Account with ID ${numericId} not found.`);
    }

    return {
      message: `Details of Account ${numericId}`,
      account
    };
  } catch (error) {
    console.error('Error fetching account details:', error);
    throw new Error('Unable to fetch account details. Please try again later.');
  }
}

async function changeProfileById(req, accountId) {
  const file = req.file;
  try {
  
    const numericId = parseInt(accountId, 10);
    if (isNaN(numericId)) {
      throw new Error(`Invalid ID provided: ${accountId}`);
    }

  
    const account = await prisma.users.findUnique({
      where: { id: numericId },
    });

    if (!account) {
      throw new Error(`Account with ID ${numericId} not found.`);
    }

    let newImage = account.image;
    if (file) {
   
      const result = await uploadFile(file.path, 'avatars');
      newImage = result.secure_url;

   
      if (account.image) {
        await deleteFile(account.image);
      }

    
      await fs.unlink(file.path);
    }

 
    const updatedAccount = await prisma.users.update({
      where: { id: numericId },
      data: {
        fullName: req.body.fullName || account.fullName,
        country: req.body.country || account.country,
        city: req.body.city || account.city,
        phone: req.body.phone || account.phone,
        sex: req.body.sex || account.sex,
        bio: req.body.bio || account.bio,
        avatar: newImage, 
      },
    });

    return {
      message: 'Account profile updated successfully',
      account: updatedAccount,
    };
  } catch (error) {
    console.error('Error updating account profile:', error);
    throw new Error('Unable to update account profile. Please try again later.');
  }
}


module.exports = { getAccountDetailById, changeProfileById };