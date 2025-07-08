import { Test, TestingModule } from "@nestjs/testing";
import { DataController } from "../controllers/data.controller";
import { PrismaService } from "../services/prisma.service";
import { UserService } from "../services/user.service";

describe('DataController',() => {
  let dataController:DataController;

  beforeEach(async () => {
    const app:TestingModule = await Test.createTestingModule({
      controllers:[DataController],
      providers:[UserService,PrismaService]
    }).compile();

    dataController = app.get<DataController>(DataController);
  });

  describe('Check data for correctness',() => {

    it('Return phone codes for authorization page',async () => {
      const codes = await dataController.getAllPhoneCodes();

      expect(Object.hasOwn(codes,'Ukraine')).toBeTruthy();
    });

    it('Return months for current language',async () => {
      const monthUa = await dataController.getCurrentMonth('uk');
      const monthEn = await dataController.getCurrentMonth('en');

      const hasOwnMonth = (monthArr:{id:number,month:string}[],monthName:string) => {
        return Boolean(
          monthArr.find(({month})=> month == monthName)
        );
      }

      expect([hasOwnMonth(monthUa,'січня'),hasOwnMonth(monthEn,'January')].every(result => result === true)).toBeTruthy();
    });

    it('Return user status',async () => {
      const status = await dataController.getUserStatus('+380000000000') ?? {};

      expect(Object.hasOwn(status,'status')).toBeTruthy();
    });
  });
});