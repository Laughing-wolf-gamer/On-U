import BannerModel from "../../model/banner.model.js";
import CategoryBannerModel from "../../model/category.banner.model.js";
import ContactQuery from "../../model/ContactQuery.model.js";
import Coupon from "../../model/Coupon.model.js";
import Option from "../../model/options.model.js";
import ProductModel from "../../model/productmodel.js";
import WebSiteModel from "../../model/websiteData.model.js";
import logger from "../../utilis/loggerUtils.js";
import { sendCouponMail } from "../emailController.js";

export const getHomeBanners = async (req,res)=>{
	try {
		const banners = await BannerModel.find({});
		// console.log("Banners: ",banners)
		return res.status(200).json({Success: true,message:"Successfully Fetched Banners", result:banners || []});
	} catch (error) {
		console.error(`Error getting Banners: `,error);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
export const addHomeCarousalMultiple = async (req, res) => {
    try {
        // Destructuring inputs from the request body
        const { images, CategoryType, Header } = req.body;

        // Validation check for images
        if (!images || !images.length) {
            return res.status(400).json({ Success: false, message: "At least one image is required" });
        }

        // Extract image URLs
        const imageUrls = images.map(img => img.url);
        console.log("Add Home Carousal Multiple req.body", imageUrls);

        // Find existing banner by CategoryType
        let banner = await BannerModel.findOne({ CategoryType });

        // If no banner found, create a new one
        if (!banner) {
            banner = new BannerModel({
                CategoryType,
                Header,
                Url: imageUrls,
            });
        } else {
            // Update banner's header and add new images if needed
            if (Header) {
                banner.Header = Header;
            }
            if (imageUrls.length) {
                banner.Url.push(...imageUrls);
            }
        }

        // Save the banner document
        await banner.save();

        // Fetch all banners (assuming you need all for response)
        const banners = await BannerModel.find({});

        console.log("Banners: ", banners);

        // Send success response with all banners
        return res.status(201).json({
            Success: true,
            message: 'Home Carousal added successfully!',
            result: banners
        });

    } catch (error) {
        // Log error and return internal server error response
        console.error("Error adding home carousel:", error);
        logger.error(`Error adding home carousel: ${error.message}`);
        
        return res.status(500).json({
            Success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

/* export const addHomeCarousalMultiple = async(req,res)=>{
	try {
		const{images,CategoryType,Header} = req.body;
		const ImageFiltered = images.map(img => img.url)
		console.log("Add Home Carousal Multiple req.body",images.map(img => img.url));
		if(!images ||!images.length) return res.status(400).json({Success: false, message: "At least one image is required"});
		let banner = await BannerModel.findOne({CategoryType: CategoryType});
		if(!banner){
			banner = new BannerModel({CategoryType: CategoryType, Header: Header, Url: [...ImageFiltered]});
		}else{
			if(Header){
                banner.Header = Header;
            }
            if(ImageFiltered && ImageFiltered.length > 0){
                banner.Url.push(...ImageFiltered);
            }

		}
		await banner.save();
		const banners = await BannerModel.find({});
		console.log("Banners: ",banners)
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banners});
	} catch (error) {
		console.error(`Error getting`,error);
        logger.error("Error getting: " + error.message);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
} */

/* export const addHomeCarousal = async (req, res) => {
	try {
		const{url,CategoryType,Header} = req.body;
		console.log("Add Home Carousal req.body",req.body);
		if(!url && !Header) return res.status(400).json({Success: false, message: "URL is required"});
		let banner = await BannerModel.findOne({CategoryType: CategoryType});
		if(!banner){
			banner = new BannerModel({CategoryType: CategoryType,Header:Header,Url: [url]});
		}else{
			if(Header){
				banner.Header = Header;
			}
			if(url){
				banner.Url.push(url);
			}
		}
		await banner.save();
		const banners = await BannerModel.find({});
		console.log("Banners: ",banners)
		res.status(201).json({Success: true, message: 'Home Carousal added successfully!', result: banners});
	} catch (error) {
		console.error(`Error adding Banners: `,error);
        logger.error("Error adding Banners: " + error.message);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
} */
export const addHomeCarousal = async (req, res) => {
	try {
		const { url, CategoryType, Header,name } = req.body;

		// Early validation check
		if (!url && !Header) {
			return res.status(400).json({ Success: false, message: "URL or Header is required" });
		}

		console.log("Add Home Carousal req.body", req.body);

		// Find existing banner by CategoryType
		let banner = await BannerModel.findOne({ CategoryType });

		// If no banner exists, create a new one; otherwise, update it
		if (!banner) {
			banner = new BannerModel({
				CategoryType,
				Header,
				Url: [url], // Initialize URL array with the provided URL
			});
		} else {
			if (Header) banner.Header = Header;
			if (url) banner.Url.push(url);
		}

		// Save the banner to the database
		await banner.save();

		// Fetch all banners to return
		const banners = await BannerModel.find({});

		console.log("Banners: ", banners);

		// Respond with success message and the updated banners
		return res.status(201).json({
			Success: true,
			message: 'Home Carousal added successfully!',
			result: banners,
		});

	} catch (error) {
		// Handle error and log it
		console.error("Error adding Banners:", error);
		logger.error(`Error adding Banners: ${error.message}`);

		// Respond with error message
		return res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};
	
/* export const removeHomeCarousal = async (req, res) => {
    try {
        const { id, imageIndex } = req.params;
    
        // Validate the input
        if (!id || !imageIndex) {
            return res.status(200).json({ Success: false, message: "Id and image index are required" });
        }
    
        // Find the banner by ID
        const banner = await BannerModel.findById(id);
        if (!banner) {
            return res.status(202).json({ Success: false, message: "Banner not found" });
        }
    
        console.log("Deleting Banner: ", id, imageIndex);
        console.log("Total Banner Length: ", banner.Url.length);
    
        // Validate the image index
        if (banner.Url.length <= imageIndex || imageIndex < 0) {
            return res.status(202).json({ Success: false, message: "Invalid image index" });
        }
    
        // Identify the URL to remove
        const urlToRemove = banner.Url[imageIndex];
        console.log("Url to remove: ", urlToRemove);
    
        // Update the banner by removing the URL at the specified index
        const updatedBanners = await BannerModel.findByIdAndUpdate(
            id,  // The ID of the document to update
            { $pull: { Url: urlToRemove } },  // Remove the URL from the "Url" array
            { new: true }  // Ensure the updated document is returned
        );
    
        // Handle case when the URL couldn't be removed for any reason
        if (!updatedBanners) {
            return res.status(404).json({ Success: false, message: "Banner update failed, URL not found" });
        }
    
        console.log("Updated Banners: ", updatedBanners.Url);
    
        // Respond with the updated banner
        res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: updatedBanners });
    } catch (error) {
        console.error(`Error removing banner: `, error);
        logger.error("Error removing banner: " + error.message);
        res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
    }
}; */

export const removeHomeCarousal = async (req, res) => {
    try {
        const { id, imageIndex } = req.params;

        // Validate inputs early
        if (!id || !imageIndex) {
            return res.status(400).json({ Success: false, message: "Id and image index are required" });
        }

        // Find the banner by ID
        const banner = await BannerModel.findById(id);
        if (!banner) {
            return res.status(404).json({ Success: false, message: "Banner not found" });
        }

        // Validate the image index
        if (imageIndex < 0 || imageIndex >= banner.Url.length) {
            return res.status(400).json({ Success: false, message: "Invalid image index" });
        }

        // Identify the URL to remove
        const urlToRemove = banner.Url[imageIndex];
		const isEmpty = banner.Url.length - 1 === 0
		console.log("Url to isEmpty: ", isEmpty);
		if (isEmpty) {
			const bannerWithRemovedUrl = await BannerModel.findByIdAndUpdate(
				id, 
				{ 
					$pull: { Url: urlToRemove },
					$unset: { Header: "" }  // Unset the header field if the condition is met
				},
				{ new: true }  // Ensure the updated document is returned
			);
			if (!bannerWithRemovedUrl) {
				return res.status(500).json({ Success: false, message: "Failed to remove image" });
			}
			console.log("Updated Banners: ", bannerWithRemovedUrl);
			// Respond with the updated banner
			return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: bannerWithRemovedUrl });
		}else{
			// Update the banner by removing the URL at the specified index
			const updatedBanner = await BannerModel.findByIdAndUpdate(
				id, 
				{ $pull: { Url: urlToRemove} },
				{ new: true }  // Ensure the updated document is returned
			);
			if (!updatedBanner) {
				return res.status(500).json({ Success: false, message: "Failed to remove image" });
			}

			// Respond with the updated banner
			return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: updatedBanner });
		}


    } catch (error) {
        // Handle and log error
        console.error(`Error removing banner: `, error);
        logger.error("Error removing banner: " + error.message);

        // Return internal server error
        return res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
    }
};

export const addCategoryBanners = async (req, res) => {
	try {
		const { CategoryType, Header, url } = req.body;
		console.log("Add Category Banners req.body", req.body);

		// Validate input fields
		if (!CategoryType || !url) {
			return res.status(400).json({ Success: false, message: "All fields are required" });
		}

		// Check if a banner already exists for the given CategoryType
		let banner = await CategoryBannerModel.findOne({ CategoryType });

		// If no banner exists, create a new one; otherwise, update it
		if (!banner) {
			// No existing banner for CategoryType, create a new one
			banner = new CategoryBannerModel({
				CategoryType,
				Header,
				Url: [url], // Initialize the URL array with the provided url object
			});
		} else {
			// Update the existing banner with the new Header and URL
			if (Header) banner.Header = Header;
			if (url) banner.Url.push(url); // Directly push the URL object
		}

		// Save the banner to the database
		await banner.save();

		// Fetch the updated banner or all banners, depending on your needs
		const banners = await CategoryBannerModel.find({ CategoryType });

		// Respond with a success message and the updated banners
		return res.status(201).json({
		Success: true,
		message: 'Category Banner added/updated successfully!',
		result: banners,
		});

	} catch (error) {
		// Log the error and return a server error message
		console.error("Error adding Category Banners:", error);
		logger.error(`Error adding Category Banners: ${error.message}`);
		return res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};

export const getCategoryBanners = async(req,res)=>{
	try {
        // Fetch all banners to return
        const banners = await CategoryBannerModel.find({});

        console.log("Category Banners: ", banners);

        // Respond with success message and the banners
        return res.status(200).json({
            Success: true,
            message: 'Home Carousal fetched successfully!',
            result: banners,
        });
    } catch (error) {
        console.error(`Error fetching Category Banners: `, error);
        logger.error(`Error fetching Category Banners: ${error.message}`);
        res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
    }
}
export const removeCategoryBanners = async(req,res)=>{
	try {
        const { id, imageIndex } = req.query;
		console.log("Remove Category Banners req.params", req.params);
		// Validate inputs early
        if (!id || !imageIndex) {
            return res.status(400).json({ Success: false, message: "Id and image index are required" });
        }

        // Find the banner by ID
        const banner = await CategoryBannerModel.findById(id);
        if (!banner) {
            return res.status(404).json({ Success: false, message: "Banner not found" });
        }

        // Validate the image index
        if (imageIndex < 0 || imageIndex >= banner.Url.length) {
            return res.status(400).json({ Success: false, message: "Invalid image index" });
        }

        // Identify the URL to remove
        const urlToRemove = banner.Url[imageIndex];
		const isEmpty = banner.Url.length - 1 === 0
		console.log("Url to isEmpty: ", isEmpty);
		if (isEmpty) {
			const bannerWithRemovedUrl = await CategoryBannerModel.findByIdAndUpdate(
				id, 
				{ 
					$pull: { Url: urlToRemove },
					$unset: { Header: "" }  // Unset the header field if the condition is met
				},
				{ new: true }  // Ensure the updated document is returned
			);
			if (!bannerWithRemovedUrl) {
				return res.status(500).json({ Success: false, message: "Failed to remove image" });
			}
			console.log("Updated Category Banners: ", bannerWithRemovedUrl);
			if(bannerWithRemovedUrl.Url.length <= 0){
				// Remove the banner completely
                await banner.remove();
                return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: null });
			}
			// Respond with the updated banner
			return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: bannerWithRemovedUrl });
		}else{
			// Update the banner by removing the URL at the specified index
			const updatedBanner = await CategoryBannerModel.findByIdAndUpdate(
				id, 
				{ $pull: { Url: urlToRemove} },
				{ new: true }  // Ensure the updated document is returned
			);
			if (!updatedBanner) {
				return res.status(500).json({ Success: false, message: "Failed to remove image" });
			}

			// Respond with the updated banner
			return res.status(200).json({ Success: true, message: 'Home Carousal image removed successfully!', result: updatedBanner });
		}
    } catch (error) {
        console.error(`Error removing Category Banners: `, error);
        logger.error(`Error removing Category Banners: ${error.message}`);
        res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
    }
}
export const FetchAllFilters = async (req, res) => {
	try {
		// Fetch only necessary fields
		const filters = await ProductModel.find({}).select('category subCategory gender AllColors -_id');

		// Reduce the filters data to avoid multiple iterations (more efficient)
		const filterData = filters.reduce((acc, item) => {
			if (item.category) acc.AllCategory.add(item.category);
			if (item.gender) acc.AllGenders.add(item.gender);
			if (item.subCategory) acc.AllSubCategory.add(item.subCategory);
			return acc;
		}, { AllCategory: new Set(), AllGenders: new Set(), AllSubCategory: new Set() });

		// Convert Set to array
		const result = {
			AllCategory: [...filterData.AllCategory],
			AllGenders: [...filterData.AllGenders],
			AllSubCategory: [...filterData.AllSubCategory],
		};

		// Send the response
		res.status(200).json({ Success: true, message: "All Filters", result });

	} catch (error) {
		// Log the error in a concise way
		console.error("Error Fetching Filters:", error.message);
		res.status(500).json({ Success: false, message: `Internal Server Error: ${error.message}` });
	}
};
	

/* export const setAboutData = async (req, res) => {
    try {
        const { header, subHeader, ourMissionDescription, outMoto, teamMembers } = req.body;
        console.log("About Body:", req.body);

        const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'AboutData' });

        // Helper function to conditionally set data only if provided
        const updateField = (field, newValue) => {
            if (newValue !== undefined && newValue !== null && (typeof newValue === 'string' ? newValue.trim() !== '' : newValue.length > 0)) {
                return newValue;
            }
            return field;
        };

        // If no existing AboutData is found, create a new one
        if (!alreadyFoundWebsiteData) {
            const about = new WebSiteModel({
                AboutData: {
                    header: updateField('', header),
                    subHeader: updateField('', subHeader),
                    ourMissionDescription: updateField('', ourMissionDescription),
                    outMoto: updateField([], outMoto),
                    teamMembers: updateField([], teamMembers),
                },
                tag: 'AboutData',
            });

            await about.save();
            console.log("New About Data: ", about);
            return res.status(200).json({ Success: true, message: 'About Data set successfully', result:about});
        }

        // Update existing AboutData with new values if provided
        alreadyFoundWebsiteData.AboutData = {
            header: updateField(alreadyFoundWebsiteData.header, header),
            subHeader: updateField(alreadyFoundWebsiteData.subHeader, subHeader),
            ourMissionDescription: updateField(alreadyFoundWebsiteData.ourMissionDescription, ourMissionDescription),
            outMoto: updateField(alreadyFoundWebsiteData.outMoto, outMoto),
            teamMembers: updateField(alreadyFoundWebsiteData.teamMembers, teamMembers),
        };

        await alreadyFoundWebsiteData.save();
        console.log("Already Found About Data: ", alreadyFoundWebsiteData);

        res.status(200).json({ Success: true, message: 'About Data set successfully' ,result:alreadyFoundWebsiteData});
    } catch (error) {
        console.error(`Error setting about data `, error);
        logger.error(`Error setting about data: ${error.message}`);
        res.status(500).json({ Success: false, message: `Internal Server Error ${error.message}` });
    }
}; */

export const setAboutData = async (req, res) => {
    try {
        const { header, subHeader, ourMissionDescription, outMoto, teamMembers,founderData } = req.body;
        console.log("About Body:", req.body);

        const alreadyFoundWebsiteData = await WebSiteModel.findOne({ tag: 'AboutData' });

        if (!alreadyFoundWebsiteData) {
            // No existing AboutData, create a new entry
            const newWebsiteData = new WebSiteModel({
                AboutData: {...req.body},
                tag: 'AboutData',
            });

            await newWebsiteData.save();
            console.log("New About Data Created: ", newWebsiteData);

            return res.status(200).json({
                Success: true,
                message: 'About Data set successfully',
                result: newWebsiteData,
            });
        }

		alreadyFoundWebsiteData.AboutData = {...req.body};

        await alreadyFoundWebsiteData.save();
        console.log("Updated About Data: ", alreadyFoundWebsiteData);

        res.status(200).json({
            Success: true,
            message: 'About Data updated successfully',
            result: alreadyFoundWebsiteData,
        });
    } catch (error) {
        console.error("Error setting about data:", error.message);
        logger.error("Error setting about data: " + error.message);
        res.status(500).json({
            Success: false,
            message: `Internal Server Error: ${error.message}`,
        });
    }
};

/* export const setTermsAndConditionWebsite = async(req,res)=>{
	try {
		console.log("terms and Condition Data",req.body);
		const alreadyPresetTermsAndCondition = await WebSiteModel.findOne({ tag: 'terms-and-condition' });
		if(alreadyPresetTermsAndCondition){
			alreadyPresetTermsAndCondition.termsAndCondition = req.body;
			await alreadyPresetTermsAndCondition.save();
			return res.status(200).json({Success:true,message:"Succeffully Termns and Condition"})
		}
		const termsAndConditionSet = new WebSiteModel({termsAndCondition: req.body, tag: 'terms-and-condition'});
		await termsAndConditionSet.save();
		console.log("New Terms and Condition: ",termsAndConditionSet)
		res.status(200).json({Success:true,message:"Succeffully Termns and Condition"})
	} catch (error) {
		res.status(500).json({Success:false,message:"Internal server Error"})
	}
} */

export const setTermsAndConditionWebsite = async (req, res) => {
	try {
		const termsAndConditionData = req.body;
		// console.log("Terms and Condition Data received: ", termsAndConditionData);
	
		// Check if the "Terms and Condition" data already exists
		let websiteData = await WebSiteModel.findOne({ tag: 'terms-and-condition' });
	
		if (websiteData) {
		// If the document exists, update the terms and condition
		websiteData.termsAndCondition = termsAndConditionData;
		await websiteData.save();
		return res.status(200).json({ Success: true, message: "Terms and Conditions updated successfully." });
		}
	
		// If the document does not exist, create a new entry
		const newTermsAndCondition = new WebSiteModel({
		termsAndCondition: termsAndConditionData,
		tag: 'terms-and-condition',
		});
	
		await newTermsAndCondition.save();
		console.log("New Terms and Condition created: ", newTermsAndCondition);
	
		res.status(200).json({ Success: true, message: "Terms and Conditions set successfully." });
	
	} catch (error) {
		console.error("Error setting Terms and Conditions:", error.message);
		res.status(500).json({
		Success: false,
		message: `Internal Server Error: ${error.message}`,
		});
	}
};

/* export const getTermsAndConditionWebsite = async(req,res)=>{
	try {
		const termsAndCondition = await WebSiteModel.findOne({ tag: 'terms-and-condition' });
		console.log("termsAndCondition: ",termsAndCondition);
		if(termsAndCondition){
            res.status(200).json({Success:true,message:"Terms and Condition",result:termsAndCondition.termsAndCondition})
        }else{
            res.status(200).json({Success:false,message:"No Terms and Condition found",result:null})
        }
	} catch (error) {
		console.error("Error while getting terms and condition: ",error);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
} */

export const getTermsAndConditionWebsite = async (req, res) => {
	try {
		// Fetch terms and condition data based on the tag 'terms-and-condition'
		const termsAndCondition = await WebSiteModel.findOne({ tag: 'terms-and-condition' });
	
		if (termsAndCondition) {
			// Return the found terms and condition if exists
			return res.status(200).json({
				Success: true,
				message: "Terms and Conditions fetched successfully",
				result: termsAndCondition.termsAndCondition,
			});
		}
	
		// If no terms and condition data found, return a friendly message
		return res.status(200).json({
			Success: false,
			message: "No Terms and Conditions found",
			result: null,
		});
		
	} catch (error) {
		// Log detailed error message for debugging purposes
		console.error("Error while fetching terms and conditions: ", error.message);
		logger.error(`Error While Fetching Terms and Conditions: ${error.message}`)
		// Return the error in response
		res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`,
		});
	}
};
	  


/* export const setPrivacyPolicyWebsite = async(req,res)=>{
	try {
		// console.log("Privacy and Policy Data",req.body);
		const alreadyprivacyPolicy = await WebSiteModel.findOne({ tag: 'privacy-policy' });
		if(alreadyprivacyPolicy){
			alreadyprivacyPolicy.privacyPolicy = req.body;
			await alreadyprivacyPolicy.save();
			return res.status(200).json({Success:true,message:"Succeffully Termns and Condition"})
		}
		const privacyPolicySet = new WebSiteModel({privacyPolicy: req.body, tag: 'privacy-policy'});
		await privacyPolicySet.save();
		console.log("New Terms and Condition: ",privacyPolicy)
		res.status(200).json({Success:true,message:"Succeffully set Privacy And Policy"})
	} catch (error) {
		res.status(500).json({Success:false,message:"Internal server Error"})
	}
} */
export const setPrivacyPolicyWebsite = async (req, res) => {
	try {
		// Search for existing privacy policy document
		const existingPrivacyPolicy = await WebSiteModel.findOne({ tag: 'privacy-policy' });
	
		// If the document already exists, update it
		if (existingPrivacyPolicy) {
			existingPrivacyPolicy.privacyPolicy = req.body;
			await existingPrivacyPolicy.save();
			return res.status(200).json({
				Success: true,
				message: "Successfully updated Privacy Policy"
			});
		}
	
		// If no document exists, create a new one
		const newPrivacyPolicy = new WebSiteModel({
			privacyPolicy: req.body,
			tag: 'privacy-policy'
		});
		await newPrivacyPolicy.save();
	
		// Log success for newly created Privacy Policy
		console.log("New Privacy Policy set: ", newPrivacyPolicy);
	
		return res.status(200).json({
			Success: true,
			message: "Successfully set Privacy Policy"
		});
	} catch (error) {
		// Log error details for debugging purposes
		console.error("Error setting Privacy Policy: ", error.message);
	
		return res.status(500).json({
			Success: false,
			message: `Internal Server Error: ${error.message}`
		});
	}
};
	  
export const getPrivacyPolicyWebsite = async(req,res)=>{
	try {
		const privacyPolicy = await WebSiteModel.findOne({ tag: 'privacy-policy' });
		// console.log("termsAndCondition: ",privacyPolicy);
		if(privacyPolicy){
            res.status(200).json({Success:true,message:"Privacy Policy found Succeffully",result:privacyPolicy.privacyPolicy})
        }else{
            res.status(200).json({Success:false,message:'privacy poliicy not found',result:null})
        }
	} catch (error) {
		console.error("Error while getting Privacy and Policy: ",error);
		logger.error("Error while getting Privacy and Policy" + error.message);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
export const setFAQWebsite = async (req, res) => {
	try {
		const {faqData} = req.body;
		console.log("FAQ Array: ",faqData);
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'faq'});
		if(!alreadyFoundWebsiteData){
			const faq = new WebSiteModel({faqArray: [faqData], tag: 'faq'});
            await faq.save();
            console.log("FAQ Array: ",faq)
            return res.status(200).json({Success:true,message:"Succefully Set FAQ"});
		}
		alreadyFoundWebsiteData.faqArray.push({...faqData});
		await alreadyFoundWebsiteData.save();
		res.status(200).json({Success: true, message: 'FAQ set successfully'});
	} catch (error) {
		console.error("Error while setting FAQ: ",error);
		logger.error(`Error while setting FAQ: ${error.message}`);
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
export const removeFAQById = async(req,res)=>{
	try {
        const {faqId} = req.query;
        console.log("FAQ ID: ",faqId);
        const alreadyFoundWebsiteData = await WebSiteModel.findOneAndUpdate({tag: 'faq'}, {$pull: {faqArray: {_id:faqId}}}, {new: true});
        console.log("Updated FAQ Array: ",alreadyFoundWebsiteData)
        res.status(200).json({Success: true, message: 'FAQ removed successfully'});
    } catch (error) {
        console.error("Error while removing FAQ: ",error);
        logger.error(`Error while removing FAQ: ${error.message}`);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
    }
}
export const getFAQWebsite = async(req,res)=>{
	try {
        const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'faq'});
        console.log("FAQ Array: ",alreadyFoundWebsiteData)
		if(!alreadyFoundWebsiteData){
			return res.status(200).json({Success:false, message:"No FAQ found",result: []});
		}
        res.status(200).json({Success:true, message:"FAQ Array",result: alreadyFoundWebsiteData?.faqArray || []});
    } catch (error) {
        console.error(`Error getting FAQ: ${error}`);
        logger.error(`Error getting FAQ: ${error.message}`);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
    }
}

export const setContactUsePageData = async (req, res) => {
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag:"contact-us"});
		console.log("req.body: ",req.body);
		if(!alreadyFoundWebsiteData){
			const contact = new WebSiteModel({ContactUsePageData: req.body, tag: 'contact-us'});
            await contact.save();
            console.log("Contact Use Page Data: ",contact)
            return;
		}
		alreadyFoundWebsiteData.ContactUsePageData = req.body;
		await alreadyFoundWebsiteData.save();
		console.log("Contact Use Page Data: ",alreadyFoundWebsiteData)
		res.status(200).json({Success: true, message: 'Contact Use Page Data set successfully'});
	} catch (error) {
		console.error("Internal Server Error", error);
        logger.error(`Error setting contact-us data: ${error.message}`)
		res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
export const getContactUsPageData = async(req,res)=>{
	try {
        const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'contact-us'});
        // console.log("Contact Use Page Data: ",alreadyFoundWebsiteData)
        res.status(200).json({Success:true,message:"Contact Use Page Data",result: alreadyFoundWebsiteData?.ContactUsePageData || {}});
    } catch (error) {
        console.error(`Error getting`,error);
        logger.error(`Error getting contact: ${error.message}`);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
    }
}
export const getContactQuery = async(req,res)=>{
	try {
        const queries = await ContactQuery.find({});
        console.log("Contact Queries: ",queries)
        res.status(200).json({Success:true,message:"Contact Queries",result: queries});
    } catch (error) {
        console.error(`Error getting`,error);
        logger.error(`Error getting contact queries: ${error.message}`);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
    }
}
export const createContactQuery = async(req,res)=>{
	try {
		console.log("Query Data: ",req.body);
		const{contactDetails,message} = req.body;
		if(!contactDetails){
			return res.status(400).json({Success: false, message: "Contact Details are required"});
		}
		if(!message){
			return res.status(400).json({Success: false, message: "Message is required"});
		}
		const newQuery = new ContactQuery({QueryDetails:{...contactDetails},QueryMessage:message});
		await newQuery.save();
		res.status(201).json({Success: true, message: 'Query created successfully!', result: newQuery});
	} catch (error) {
		console.error("Error creating contact query: ",error);
        logger.error(`Error creating contact query: ${error.message}`);
		res.status(500).json({Success: false, message: 'Internal Server Error'});
	}
}
export const getConvenienceFees = async(req,res)=>{
	try {
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'ConvenienceFees'});
		console.log("Convenience Fees: ",alreadyFoundWebsiteData)
		res.status(200).json({Success:true,message:"Convenience Fees",result: alreadyFoundWebsiteData?.ConvenienceFees || 0});
	} catch (error) {
		console.error(`Error getting`,error);
        logger.error(`Error getting convenience fees: ${error.message}`);
        res.status(500).json({Success: false, message: `Internal Server Error ${error.message}`});
	}
}
/* export const patchConvenienceOptions = async(req,res)=>{
	try {
		const {convenienceFees} = req.body;
		console.log("Convenience: ",req.body);
		if(!convenienceFees){
			return res.status(400).json({Success: false, message: "Convenience Fees are required"});
		}
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'ConvenienceFees'});
		if(!alreadyFoundWebsiteData){
            const newConvenienceFees = new WebSiteModel({tag: 'ConvenienceFees',ConvenienceFees:convenienceFees});
			await newConvenienceFees.save();
			console.log("Convenience Fees: ",newConvenienceFees)
            res.status(200).json({Success:true,message: 'Convenience Fees Patched successfully',result: newConvenienceFees?.ConvenienceFees || 0});
        }
		alreadyFoundWebsiteData.ConvenienceFees = Number(convenienceFees);
		await alreadyFoundWebsiteData.save();
		// console.log("Convenience Fees: ",alreadyFoundWebsiteData)
		res.status(200).json({Success:true,message: 'Convenience Fees Patched successfully',result: alreadyFoundWebsiteData?.ConvenienceFees || 0});
	} catch (error) {
		console.error("Error Patching Options: ",error);
		res.status(500).json({Success:false,message: 'Internal Server Error'});
	}
} */
export const patchConvenienceOptions = async (req, res) => {
	try {
		const { convenienceFees } = req.body;
	
		// Ensure convenienceFees is provided
		if (!convenienceFees) {
		return res.status(400).json({ Success: false, message: "Convenience Fees are required" });
		}
	
		// Convert convenienceFees to a number and handle invalid inputs
		const feeValue = Number(convenienceFees);
		if (isNaN(feeValue)) {
		return res.status(400).json({ Success: false, message: "Invalid convenience fee value" });
		}
	
		// Check if the convenience fees already exist in the database
		let websiteData = await WebSiteModel.findOne({ tag: 'ConvenienceFees' });
	
		// If no data found, create a new record
		if (!websiteData) {
			websiteData = new WebSiteModel({ tag: 'ConvenienceFees', ConvenienceFees: feeValue });
			await websiteData.save();
			return res.status(200).json({
				Success: true,
				message: 'Convenience Fees added successfully',
				result: websiteData.ConvenienceFees,
			});
		}
	
		// If found, update the existing data
		websiteData.ConvenienceFees = feeValue;
		await websiteData.save();
	
		return res.status(200).json({
		Success: true,
		message: 'Convenience Fees updated successfully',
		result: websiteData.ConvenienceFees,
		});
	
	} catch (error) {
		console.error("Error Patching Convenience Fees: ", error.message); // Only log error message for clarity
		res.status(500).json({ Success: false, message: 'Internal Server Error' });
	}
};
	  
export const removeAddressFormField = async(req,res)=>{
	try {
		const {addressFormFields} = req.body;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'Address'}); 
		if(!alreadyFoundWebsiteData){
			return res.status(404).json({Success:false,message: 'Address Data not found'});
		}
		const index = alreadyFoundWebsiteData.Address.findIndex(item => item === addressFormFields);
		if(index === -1){
			return res.status(404).json({Success:false,message: 'Address Data not found'});
		}
		alreadyFoundWebsiteData.Address.splice(index,1);
		await alreadyFoundWebsiteData.save();
		console.log("Address Data: ",alreadyFoundWebsiteData)
		res.status(200).json({Success:true,message: 'Address Data removed successfully',result: alreadyFoundWebsiteData?.Address || []});
	} catch (error) {
		console.error(`Error setting about data `,error);
		res.status(500).json({Success:false,message: 'Internal Server Error',result:[]});
	}
}
export const setAddressField = async(req,res)=>{
	try {
		const {addressFormFields} = req.body;
		const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'Address'}); 
		if(!alreadyFoundWebsiteData){
			const about = new WebSiteModel({Address: [addressFormFields],tag: 'Address'});
			await about.save();
			console.log("Address Data: ",about)
			return res.status(200).json({Success:true,message: 'Address Data set successfully'});
		}
		alreadyFoundWebsiteData.Address.push(addressFormFields);
		await alreadyFoundWebsiteData.save();
		console.log("Address Data: ",alreadyFoundWebsiteData)
		res.status(200).json({Success:true,message: 'Address Data set successfully',result: alreadyFoundWebsiteData?.Address || []});
	} catch (error) {
		console.error(`Error setting about data `,error);
		res.status(500).json({Success:false,message: 'Internal Server Error',result:[]});
	}
}
export const setWebsiteDisclaimers = async(req,res)=>{
    try {
        const {websiteDisclaimers} = req.body;
        const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'WebsiteDisclaimers'}); 
        if(!alreadyFoundWebsiteData){
            const about = new WebSiteModel({WebsiteDisclaimers: [websiteDisclaimers], tag: 'WebsiteDisclaimers'});
            await about.save();
            // console.log("Website Disclaimers: ",about)
            return res.status(200).json({Success:true,message: 'Website Disclaimers set successfully'});
        }
        alreadyFoundWebsiteData.WebsiteDisclaimers.push(websiteDisclaimers);
        await alreadyFoundWebsiteData.save();
        // console.log("Website Disclaimers: ",alreadyFoundWebsiteData)
        res.status(200).json({Success:true,message: 'Website Disclaimers set successfully',result: alreadyFoundWebsiteData?.WebsiteDisclaimers || []});
    } catch (error) {
        console.error(`Error setting about data `,error);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const editDisclaimers = async(req,res)=>{
    try {
        const {disclaimersId, disclaimers} = req.body;
        const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'WebsiteDisclaimers'});
        if(!alreadyFoundWebsiteData){
            return res.status(404).json({Success:false, message: 'Website Disclaimers not found'});
        }
        const index = alreadyFoundWebsiteData.WebsiteDisclaimers.findIndex(item => item._id.toString() === disclaimersId);
        if(index === -1){
            return res.status(404).json({Success:false, message: 'Website Disclaimers not found'});
        }
        alreadyFoundWebsiteData.WebsiteDisclaimers[index] = disclaimers;
        await alreadyFoundWebsiteData.save();
        console.log("Website Disclaimers: ",alreadyFoundWebsiteData)
        
    } catch (error) {
        console.error(`Error setting about data`,error);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const removeWebsiteDisclaimers = async(req,res)=>{
    try {
        const {disclaimersId} = req.params;
        const alreadyFoundWebsiteData = await WebSiteModel.findOne({tag: 'WebsiteDisclaimers'});
        if(!alreadyFoundWebsiteData){
            return res.status(404).json({Success:false, message: 'Website Disclaimers not found'});
        }
        const index = alreadyFoundWebsiteData.WebsiteDisclaimers.findIndex(item => item._id.toString() === disclaimersId);
        if(index === -1){
            return res.status(404).json({Success:false, message: 'Website Disclaimers not found'});
        }
        alreadyFoundWebsiteData.WebsiteDisclaimers.splice(index,1);
        await alreadyFoundWebsiteData.save();
        console.log("Website Disclaimers: ",alreadyFoundWebsiteData)
        
    } catch (error) {
        console.error(`Error setting about data`,error);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const getWebsiteDisclaimers = async(req,res)=>{
    try {
        const aboutData = await WebSiteModel.findOne({tag:'WebsiteDisclaimers'});
        if(!aboutData){
            return res.status(404).json({Success:false, message: 'Website Disclaimers not found'});
        }
        console.log("All Website Disclaimers: ",aboutData)
        res.status(200).json({Success:true,message: 'Website Disclaimers Found',result: aboutData.WebsiteDisclaimers || []});
    } catch (error) {
        console.error(`Error getting website disclaimers:`,error);
        res.status(500).json({Success:false,message: 'Internal Server Error'});
    }
}
export const getAddressField = async(req,res)=>{
	try {
	  const aboutData = await WebSiteModel.findOne({tag:'Address'});
	  console.log("Address Data: ",aboutData?.Address)
	  res.status(200).json({Success:true,message: 'Address Data Found',result: aboutData?.Address || []});
	} catch (error) {
		console.error(`Error setting about data `,error);
		res.status(500).json({Success:false,message: 'Internal Server Error'});
	}
}
export const getAboutData = async(req,res)=>{
	try {
	  const aboutData = await WebSiteModel.findOne({tag:'AboutData'});
	  console.log("Client About Data: ",aboutData)
	  res.status(200).json({Success:true,message: 'About Data Found',aboutData: aboutData?.AboutData || {}});
	} catch (error) {
		console.error(`Error setting about data `,error);
		res.status(500).json({Success:false,message: 'Internal Server Error'});
	}
}




export const getAllOptions = async(req,res)=>{
	try {
		const allOptions = await Option.find({});
		res.status(200).json({success:true,message:"Fetch All Options",result:allOptions || []})
	} catch (error) {
		console.error(`Error Fetching Options`,error);
		res.status(500).json({success:false,message:"Failed to fetch all options"})
	}
}
// Fetch all options of a specific type
export const getOptions = async (req, res) => {
	try {
		const { type } = req.params; // Get the type of option (e.g., category)
		
		if (!['category', 'subcategory', 'color', 'clothingSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}
	
		const options = await Option.find({ type });
		res.status(200).json({Success:true,message:"Featch All Options",result:options});
	} catch (error) {
	  	res.status(500).json({ message: 'Server error' });
	}
};
  
  // Add a new option
export const addOption = async (req, res) => {
	try {
		const { type, value } = req.body;
	
		if (!['category', 'subcategory', 'color', 'clothingSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}
	
		const existingOption = await Option.findOne({ type, value });
		if (existingOption) {
			return res.status(400).json({ message: 'Option already exists' });
		}
	
		const newOption = new Option({ type, value });
		await newOption.save();
	
		res.status(201).json({ Success:true,message: 'Option added successfully', result: newOption });
	} catch (error) {
	  	res.status(500).json({ message: 'Server error' ,result:null});
	}
};

export const updateColorName = async(req,res)=>{
	try {
        const { updatingData} = req.body;
        const { type, value, name } = JSON.parse(updatingData);
		console.log("Updating colors...",updatingData);
        if (!['category', 'subcategory', 'color', 'clothingSize','footWearSize', 'gender'].includes(type)) {
            return res.status(400).json({ message: 'Invalid option type' });
        }
		const updatedOption = await Option.findOneAndUpdate(
			{ type, value },
			{ name: name }, // Toggle the value
			{ new: true } // Return the updated document
		);
		if(!updatedOption){
			return res.status(404).json({ message: 'Option not found' });
		}
		const allProductsUpdate = await ProductModel.updateMany(
			{},  // Empty filter to match all products
			{ 
				$set: {
				"AllColors.$[elem].name": name  // Update the name of the matching label
				}
			},
			{
				arrayFilters: [
				{ "elem.label": value }  // Specify the label to match (e.g., "color")
				]
			}
		);
		console.log("Updated Products: ",allProductsUpdate);
		res.status(200).json({ Success:true,message: 'Color Option updated successfully', result: updatedOption });
    } catch (error) {
        console.error(`Error updating color name`, error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export const updateIsActive = async (req, res) => {
	try {
		const { updatingData} = req.body;
        const { type, value } = JSON.parse(updatingData);
    
        if (!['category', 'subcategory', 'color', 'clothingSize','footWearSize', 'gender'].includes(type)) {
            return res.status(400).json({ message: 'Invalid option type' });
        }
		
        const option = await Option.findOne({ type, value }); // Find the option by type and value
		if (!option) {
			return res.status(404).json({ message: 'Option not found' });
		}

		// Toggle the isActive value
		const updatedOption = await Option.findOneAndUpdate(
			{ type, value },
			{ isActive: !option.isActive }, // Toggle the value
			{ new: true } // Return the updated document
		);
        res.status(200).json({ Success:true,message: 'Option updated successfully', result: updatedOption });
    } catch (error) {
		res.status(500).json({ message: 'Server error' });
    }
}
// Delete an option by its value
export const removeOptionsByType = async (req, res) => {
	try {
		// const parseData = JSON.parse(req.body);
		const { removingData} = req.body;
		const {type,value} = JSON.parse(removingData);
		console.log("Delete Options: ",type,value);
		if (!['category', 'subcategory', 'color', 'clothingSize','footWearSize', 'gender'].includes(type)) {
			return res.status(400).json({ message: 'Invalid option type' });
		}
		let canRemoveOption = true;
		switch (type) {
			case 'category':
                const availableProductCategoryItems = await ProductModel.find({category: value})
				if(availableProductCategoryItems.length > 0){
					canRemoveOption = false;
				}
                break;
            case'subcategory':
				const availableProductSubCategoryItems = await ProductModel.find({subCategory: value})
				if(availableProductSubCategoryItems.length > 0){
					canRemoveOption = false;
				}
                break;
            case 'gender':
                const availableProductGenderItems = await ProductModel.find({gender: value})
				if(availableProductGenderItems.length > 0){
					canRemoveOption = false;
				}
                break;
            default:
		}
		if(!canRemoveOption){
			return res.status(400).json({Success:true,message:"Cannot Remove Items If used"});
		}
		const deleted = await Option.findOneAndDelete({ type, value });
		console.log("Deleted Options: ",deleted);
		res.status(200).json({ Success:true,message: 'Option deleted successfully' });

	} catch (error) {
		console.error("Error Deleting Options ",error);
		res.status(500).json({ message: 'Server error' });
        logger.error(`Error Deleting Options: `,error);
	}
};
export const fetchCouponsByQuery = async (req,res)=>{
    try {
        // const {query} = req.query;
        console.log("Fetching Coupons Query: ",req.query);
        const filter = {};
		filter.Status = "Active";
        if(req.query){
            /* if(req.query.Status){
            } */
            if(req.query.MinimumAmount){
                filter.MinimumAmount = {$lte: query.MinimumAmount}
            }
            if(req.query.FreeShipping){
                filter.FreeShipping = req.query.FreeShipping === 'true' ? true : false;
            }
            if(req.query.CustomerLogin){
                filter.CustomerLogin = req.query.CustomerLogin === 'true' ? true : false;
            }
            if(req.query.Discount){
                filter.Discount ={ $gt: req.query.Discount};
            }
            if(req.query.Category){
                filter.Category = req.query.Category;
            }
			if(filter.ValidDate){
				filter.ValidDate = {$lt: Date.now()}
			}
        }
        // filter.ValidDate = {$lt: Date.now()}
        const foundCoupons = await Coupon.find(filter).limit(10);
        // console.log("Fetched Coupons: ",foundCoupons);
        res.status(200).json({success:true,message:"Successfully fetched Coupons",result:foundCoupons || []});
    } catch (error) {
        console.error(`Error getting Coupons: `,error);
        res.status(500).json({success: false, message: `Internal Server Error ${error.message}`});
        logger.error(`Error getting Coupons: `,error);
    }
}

export const sendMailToGetCoupon = async (req,res)=>{
	try {
		const{fullName,email} = req.body;
		const coupon = await Coupon.aggregate([{ $sample: { size: 1 } }]);
		const randomCoupon = coupon[0]; // Get the first (and only) item in the array
		if(randomCoupon){
			const success = await sendCouponMail(fullName,email,randomCoupon?.CouponCode)
			console.log("Coupon sent: ",success)
			if(!success){
                return res.status(500).json({ success:false,message: 'Failed to send coupon email'});
			}
			return res.status(200).json({ success:true,message: 'Coupon sent successfully'});
		}
		res.status(404).json({ success:false,message: 'No coupon found'});
	} catch (error) {
		console.error("Error sending email: ", error);
		res.status(500).json({ success:false,message: 'Failed to send email' });
	}
}


export const setCouponBannerData = async (req,res)=>{
	try {

		// const { header, subHeader,bannerModelUrl} = req.body;
        console.log("About Body:", req.body);

        const alreadyPresetCouponBannerData = await WebSiteModel.findOne({ tag: 'Coupon-banner' });

        if (!alreadyPresetCouponBannerData) {
            // No existing AboutData, create a new entry
            const newWebsiteData = new WebSiteModel({
                CouponBannerData: {...req.body},
                tag: 'Coupon-banner',
            });

            await newWebsiteData.save();
            console.log("New Copuon Banner Data Created: ", newWebsiteData);

            return res.status(200).json({
                Success: true,
                message: 'Coupon Banner Data set successfully',
                result: newWebsiteData,
            });
        }

		alreadyPresetCouponBannerData.CouponBannerData = {...req.body};

        await alreadyPresetCouponBannerData.save();
        console.log("Updated About Data: ", alreadyPresetCouponBannerData);

        res.status(200).json({
            Success: true,
            message: 'About Data updated successfully',
            result: alreadyPresetCouponBannerData,
        });
	} catch (error) {
		console.error("Error setting coupon banner data: ", error);
		logger.error(`Error setting coupon banner data: ${error.message}`);
		res.status(500).json({ success: false, message: 'Failed to set coupon banner data' });
	}
}
export const getCouponBannerData = async (req,res)=>{
	try {
		const termsAndCondition = await WebSiteModel.findOne({ tag: 'Coupon-banner' });
	
		if (termsAndCondition) {
			// Return the found terms and condition if exists
			return res.status(200).json({
				Success: true,
				message: "Coupon-banner fetched successfully",
				result: termsAndCondition.CouponBannerData,
			});
		}
	
		// If no terms and condition data found, return a friendly message
		return res.status(200).json({
			Success: false,
			message: "No Coupon-bannerfound",
			result: null,
		});
	} catch (error) {
		console.error("Error getting coupon banner data: ", error);
		logger.error(`Error getting coupon banner data: ${error.message}`);
		res.status(500).json({ success: false, message: 'Failed to get coupon banner data' });
	}
}

  