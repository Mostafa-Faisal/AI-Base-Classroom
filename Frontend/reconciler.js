// function findDiff(arr1, arr2) {
//     let updated = 0, added = 0, removed = 0;
//     for (let i = 0; i < arr2.length; i++) {
//         let found = false;
//         for (let j = 0; j < arr1.length; j++) {
//             if (arr2[i] === arr1[j]) {
//                 found = true;
//             }
//         }
//         if (found) {
//             updated++;
//         }
//         else {
//             added++;
//         }
//     }


//     for(let i = 0; i< arr1.length; i++) {
//         let found = false;
//         for(let j = 0; j< arr2.length; j++) {
//             if(arr1[i] === arr2[j]) {
//                 found = true;
//             }
//         }
//         if(!found) {
//             removed++;
//         }
//     }



//     return {updated : updated, added : added, removed: removed};
// }

// let diff = findDiff([1,2,3,4,5], [1,2,7, 8]);
// console.log(diff);





// 2. double the array

// let arr = [1,2,4,8];

// function duble(inputArr) {
//     let newArr = [];
//     for(let i = 0; i<inputArr.length; i++) {
//         newArr.push(inputArr[i] * 2);
//     }
//     return newArr;
    
// }

// console.log(duble(arr));



// 3. double the array using map

// let arr = [1,2,4,8];

// let newArr = arr.map((value) => {
//     return value * 2;
// })

// console.log(newArr);


// 4. filter the array
var arr = [{
    name: "Mostafa",
    age: 25
}, {
    name: "Mohaimen",
    age: 35
}]

const newArr = arr.map((value) => {
    if(value.age <= 25) {
        return {
            name: value.name,
            age: value.age,
            status: "Allowed"
        }
    }
    else {
        return {
            name: value.name,
            age: value.age,
            status: "Not Allowed"
        }
    }
})

console.log(newArr);


