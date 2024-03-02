import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
import { ActiveUser } from 'src/common/decorators/active-user.decorator';
import { UserActiveInterface } from 'src/common/interfaces/user-active.interface';
import { Role } from 'src/common/enums/rol.enum';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private breedRepository: Repository<Breed>,
  ){}

  async create(createCatDto: CreateCatDto,user: UserActiveInterface) {

    const breed = await this.breedRepository.findOneBy({name: createCatDto.breed})

    if(!breed){
      throw new BadRequestException('Breed not found')

    }
    // const cat = this.catsRepository.create(createCatDto);
    return await this.catsRepository.save({
      ...createCatDto,
      breed,
      userEmail:user.email
    });
    return;
  }

  async findAll(user: UserActiveInterface) {
    if(user.role === Role.ADMIN){
      return await this.catsRepository.find()
    }

    return await this.catsRepository.find({
      where: { userEmail: user.email}
    })
  }

  async findOne(id: number, user: UserActiveInterface) {
    const cat = await this.catsRepository.findOneBy({id})
    if(!cat){
      throw new BadRequestException('Cat not found!');
    }
    this.validateOwership(cat,user);

    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto, user: UserActiveInterface) {
    await this.findOne(id,user);
    
    return await this.catsRepository.update(
      id,{
        ...updateCatDto,
        breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
        userEmail: user.email
      })
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id,user);
    return await this.catsRepository.softDelete(id)
  }

  private validateOwership(cat: Cat,user: UserActiveInterface){
    if(user.role !== Role.ADMIN && cat.userEmail !== user.email){
      throw new UnauthorizedException();
    }
  }

  private async validateBreed(breed: string){
    const breedEntity = await this.breedRepository.findOneBy({name:breed});

    if(!breedEntity){
      throw new BadRequestException('Breed not found!');
    }

    return breedEntity;
  }
}
