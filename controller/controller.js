const { log } = require("console");

const db = []

const controllers = {
    addContact: async (req, res) => {
        try {
            let err;
            let { firstName, lastName, gender, line1, line2, city, country, zipCode, email, phone, other } = req.body
            const id = new Date().getTime().toString();
            country = country.toUpperCase();
            gender = gender.toUpperCase();

            if (!id || !firstName || !lastName || !gender || !line1 || !city || !country || !zipCode || !email || !phone) {
                return res.status(400).json({ message: "Please fill all the mandatory fields" })
            }
            if (gender != "MALE" && gender != "FEMALE" && gender != "OTHER") {
                return res.status(400).json({ message: "Please Select Gender as MALE/FEMALE/OTHER" })
            }
            if (!isAlphabet(firstName) || !isAlphabet(lastName)) {
                return res.status(400).json({ message: "First and Last Name should only be using Alphabet" })
            }
            if (firstName.length < 3 && lastName.lastName < 3) {
                return res.status(400).json({ message: "First and Last Name should have a more than 2 cahr." })
            }
            if (line1.length < 8) {
                return res.status(400).json({ message: "Lind 1 of address should have more then 7 char." })
            }
            if (zipCode.length > 10) {
                return res.status(400).json({ message: "Zip Code should not be greater than 10 char." })
            }
            if (!isValidEmail(email)) {
                return res.status(400).json({ message: "please Check your Email Address." })
            }
            if (!isNumber(phone)) {
                return res.status(400).json({ message: "please Check your Phone Number." })
            }


            let unique = await uniqueIdentity(phone, email);

            if (!unique) {
                return res.status(400).json({ message: 'Contact already exists' });
            }

            let contact = {
                id: id,
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                address: {
                    line1: line1,
                    line2: line2,
                    city: city,
                    country: country,
                    zipCode: zipCode
                },
                email: email,
                phone: phone,
                other: other
            }

            db.push(contact);


            return res.status(200).json({ message: "Contace added successfullt.", db: db })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

    },
    getContacts: (req, res) => {
        try {
            return res.status(200).json(db);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    getContactsById: async (req, res) => {
        try {
            const id = req.params.id;
            const contact = await dbFindById(id);

            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' });
            } else {
                return res.status(200).json(contact);
            }

        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });

        }
    },

    updateContact: async (req, res) => {
        try {
            let id = req.params.id;
            let { firstName, lastName, gender, line1, line2, city, country, zipCode, email, phone, other } = req.body;

            if (email || phone) {
                let unique = await uniqueIdentity(phone, email);

                if (!unique) {
                    return res.status(400).json({ message: 'Email/Phone Number already exists' });
                }
            }

            const contact = await dbFindById(id);
            const indexof = await index(id);


            if (!contact || indexof === -1) return res.status(404).json({ message: 'Contact not found' });

            firstName = !firstName ? contact.firstName : firstName;
            lastName = !lastName ? contact.lastName : lastName;
            gender = !gender ? contact.gender : gender.toUpperCase();
            line1 = !line1 ? contact.address.line1 : line1;
            line2 = !line2 ? contact.address.line2 : line2;
            city = !city ? contact.address.city : city.toUpperCase();
            zipCode = !zipCode ? contact.address.zipCode : zipCode;
            email = !email ? contact.email : email;
            phone = !phone ? contact.phone : phone;
            other = !other ? contact.other : other;


            if (gender != "MALE" && gender != "FEMALE" && gender != "OTHER") {
                return res.status(400).json({ message: "Please Select Gender as MALE/FEMALE/OTHER" })
            }
            if (!isAlphabet(firstName) && !isAlphabet(lastName)) {
                return res.status(400).json({ message: "First and Last Name should only be using Alphabet" })
            }
            if (firstName.length < 3 && lastName.lastName < 3) {
                return res.status(400).json({ message: "First and Last Name should have a more than 2 cahr." })
            }
            if (line1.length < 8) {
                return res.status(400).json({ message: "Lind 1 of address should have more then 7 char." })
            }
            if (zipCode.length > 10) {
                return res.status(400).json({ message: "Zip Code should not be greater than 10 char." })
            }
            if (!isValidEmail(email)) {
                return res.status(400).json({ message: "please Check your Email Address." })
            }
            if (!isNumber(phone)) {
                return res.status(400).json({ message: "please Check your Phone Number." })
            }


            let update = {
                id: id,
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                address: {
                    line1: line1,
                    line2: line2,
                    city: city,
                    country: country,
                    zipCode: zipCode
                },
                email: email,
                phone: phone,
                other: other
            }

            db[indexof] = update;

            return res.status(200).json({ message: 'Contact updated successfully' });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    deletecontacts: async (req, res) => {
        try {
            const id = req.params.id;

            const indexof = await index(id);
            if (indexof === -1) {
                return res.status(404).json({ message: 'Contact not found' });
            }

            let deleteed = await db.splice(indexof, 1);
            if (!deleteed) return res.status(400).json({ message: 'Contact deletion failed' });
            return res.status(200).json({ message: 'Contact deleted Successfully' });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

    },

    progressbar: async (req, res) => {
        try {
            fetch('https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg')
                .then((res) => {
                    const contentLength = res.headers.get('content-length');
                    console.log('content-length', contentLength);
                    let loaded = 0;

                    const customResponse = new Response(
                        new ReadableStream({
                            start(controller) {
                                console.log('controller',controller);
                                const reader = res.body.getReader();
                                console.log("reader",reader);
                                function read() {
                                    reader.read().then(({ done, value }) => {
                                        if (done) {
                                            controller.close();
                                            return;
                                        }

                                        loaded += value.byteLength;
                                        console.log(Math.round((loaded / contentLength) * 100));
                                        controller.enqueue(value);
                                        read();
                                    });
                                }

                                read();
                            },
                        })
                    );

                    return customResponse;
                })
                .then((customResponse) => {
                    return customResponse.blob();
                })
                .then((blob) => {
                    console.log("complete");
                    return res.send({msg: "complete"})
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = controllers;


async function dbFindById(id) {
    let data = await db.find((contact) => contact.id === id);
    if (!data) return false;
    return data;
}

async function uniqueIdentity(phone, email) {
    const notUnique = await db.find((contact) => {
        return contact.email === email || contact.phone === phone
    });
    if (notUnique) return false
    return true;
}

async function index(id) {
    const indexof = await db.findIndex((contact) => contact.id === id);
    return indexof
}

function isAlphabet(str) {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(str);
}

function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

function isNumber(str) {
    const pattern = /^\d+$/;
    return pattern.test(str);
}
