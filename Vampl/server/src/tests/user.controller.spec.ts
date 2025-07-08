import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { PrismaService } from '../services/prisma.service';

describe('UserController', () => {
  let userController:UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService,PrismaService],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  describe('Check user for registration',() => {
    
    it('Should return true for register user',async () => {
      // current phone for "admin" this can be any of exist user phones
      const res = await userController.getUserPhone('+380000000000');
      expect(res).toEqual({register:true});
    });

    it('Should return false for non-register user', async () => {
      const res = await userController.getUserPhone('+185932085098');
      expect(res).toEqual({register:false});
    });
  });

  describe('Check name for existing in data-base',() => {
    it('Should return true for existing name',async () => {
      const res = await userController.checkNameExisting('Vampl');

      expect(res).toEqual({existing:true});
    });

    it('Should return false for non-existing names',async () => {
      const res = await userController.checkNameExisting('RandomName');

      expect(res).toEqual({existing:false});
    });
  });

  describe('Check information by user name',() => {
    it('Successfully get account information by name',async () => {
      const info = await userController.getUserInfo('Vampl');
    
      expect(info?.name).toEqual('Vampl');
    });
  });

});
