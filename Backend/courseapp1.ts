// import express, {Request, Response, NextFunction} from 'express';
import * as express from 'express';
import {Request, Response, NextFunction} from 'express';

import mongoose, {Document, Schema} from 'mongoose';
import * as jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());


interface ICOURSE extends Document {
    title: string;
    description: string;
    price: number;
    imageLink: string;
    published: boolean;
}

interface IUser extends Document {
    username: string;
    password: string;
    purchasedCourses: Array<{
        courseId: mongoose.Types.ObjectId;
        title: string;
        purchaseDate: Date;
    }>;
}

interface IAdmin extends Document{
    username: string;
    password: string;
}

interface JWTPayload {
    username: string;
    role: 'admin' | 'user';
}

interface AuthRequest extends Request {
    user?: JWTPayload;
}




const SECRET: string = 'SECr3t';


const userSchema = new Schema<IUser>({
    username: String,
    password: String,
    purchasedCourses: [{
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
        },
        title: String,
        purchaseDate: {type: Date, default: Date.now}
    }]
});

const adminSchema =  new Schema<IAdmin>({
    username: String,
    password: String
});

const courseSchema = new Schema<ICOURSE>({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean    
});

const User = mongoose.model<IUser>('User', userSchema);
const Admin = mongoose.model<IAdmin>('Admin', adminSchema);
const Course = mongoose.model<ICOURSE>('Course', courseSchema);


const authenticateJwt = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader =req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET, (err, user)=> {
            if(err) {
                res.sendStatus(403);
                return;
            }
            req.user = user as JWTPayload;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};


mongoose.connect('mongodb+srv://micheleldavis248:KV18aTmBIo8NZKAY@cluster5.yau4e.mongodb.net/Courses', {
    dbName: "Courses"
});

app.post('/admin/signup', async (req: Request, res: Response):Promise<void> =>{
    const{username, password} = req.body;
    const admin = await Admin.findOne({ username });

    if (admin) {
        res.status(403).json({ message: 'Admin already exists'});
        return;
    }
    const newAdmin = new Admin({username, password});
    await newAdmin.save();

    const token = jwt.sign({ username, role: 'admin'} as JWTPayload, SECRET, {expiresIn: '1h'});
    res.json({message: 'Admin created successfully', token });
});


app.post('/admin/login', async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;
    const admin = await Admin.findOne({username, password});

    if(admin) {
        const token = jwt.sign({ username, role: 'admin'} as JWTPayload, SECRET, {expiresIn: '1h'});
        res.json({message: "Logged in successfully", token});
    }
    else {
        res.status(403).json({message : 'Invalid username or password'});
    }
});


app.post('/admin/courses', authenticateJwt, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.json({ message: 'Course create successfully', courseId: course.id});
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({message: 'Error creating course', error: error.message });
        }
    }
});


app.put('/admin/course/:courseId', authenticateJwt, async (req: AuthRequest, res: Response): Promise<void> => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {new: true});
    if (course) {
        res.json({message: 'course update successfully' });
    }
    else {
        res.status(404).json({ message: 'course not found'});
    }
});


app.get('/admin/courses', authenticateJwt, async (req: AuthRequest, res: Response): Promise<void> => {
    const courses = await Course.find({});
    res.json({courses});
});



// User Routes

app.post('/users/signup', async (req: Request, res: Response): Promise<void> => {
    const { username, password} = req.body;
    const user = await User.findOne({ username});

    if(user) {
        res.status(403).json({ message: 'user already exists' });
        return;
    }

    const newUser = new User({ username, password});
    await newUser.save();
    const token = jwt.sign({username, role: 'user'} as JWTPayload, SECRET, {expiresIn: '1h'});
    res.json({message: 'User create successfully', token});
});



app.post('/users/login', async (req: Request, res: Response): Promise<void> => {
    const {username, password} = req.body;
    const user = await User.findOne({username, password});

    if(user) {
        const token = jwt.sign({username, role: 'user'} as JWTPayload, SECRET, {expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
    else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});



app.get('/users/courses', authenticateJwt, async (req: AuthRequest, res: Response): Promise<void> => {
    const courses = await Course.find({published: true});
    res.json({ courses });
});



app.post('/users/courses/:courseId', authenticateJwt, async (req: AuthRequest, res: Response): Promise<void>=>{
    const course = await Course.findById(req.params.courseId);
    if (course && req.user) {
        const user = await User.findOne({ username: req.user.username });
        if (user) {
            const purchaseEntry = {
                courseId: course._id as mongoose.Types.ObjectId,
                title: course.title,
                purchaseDate: new Date()
            };
            user.purchasedCourses.push(purchaseEntry);
            await user.save();
            res.json({ message: 'course purchased successfully'});
        }
        else {
            res.status(403).json({message: 'user not found'});
        }
    }
    else {
        res.status(404).json({message: 'course not found'});
    }
});




app.get('/users/purchasedCourse', authenticateJwt, async (req: AuthRequest, res: Response): Promise<void>=> {
    if(!req.user) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    // Find the populate section and update it to:
    const user = await User.findOne({ username: req.user.username }).populate({
        path: 'purchasedCourses.courseId',
        select: 'title description price imageLink'
    });

    if (user) {
        res.json({ purchaseCourses: user.purchasedCourses || [] });
    }
    else {
        res.status(403).json({ message: 'user not found' });
    }
});


app.listen(3000, ()=> {
    console.log('server is running on port 3000');
});





