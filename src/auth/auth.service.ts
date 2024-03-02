import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService:JwtService
    ){}

    async register({name,email,password}:RegisterDto){
        
        const user = await this.usersService.findOneByEmail(email)   
        
        if(user){
            throw new BadRequestException('User already exits!');
        }

        const hashedPassword = await bcryptjs.hash(password,10);

        await this.usersService.create({name,email,password:hashedPassword})
        return {
            name,
            email
        };
    }

    async login({email,password}:LoginDto){
        const user = await this.usersService.findByEmailWithPassword(email)   
        console.log(user);
        if(!user){
            throw new UnauthorizedException('Invalid email');
        }

        const isPasswordValid = await bcryptjs.compare(password,user.password)

        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid password');
        }

        const payload = {email:user.email, role:user.role};

        const token = await this.jwtService.signAsync(payload)
        return {
            token,
            email:user.email,
            role: user.role
        };
    } 
    
    async profile({email,role}:{email:string; role:string}){
        return await this.usersService.findOneByEmail(email)
    }
}
