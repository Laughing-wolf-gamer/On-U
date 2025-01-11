import React, { Fragment, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useTransition, animated } from 'react-spring';
import { fetchAllOptions } from '../../../action/productaction.js';

const ProductsBar = ({ show, CMenu, parentCallback }) => {
	const transitions = useTransition(show, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		delay: 200,
	});

	const { options } = useSelector((state) => state.AllOptions);
	const [productsOptions, setProductsOptions] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAllOptions());
	}, [dispatch]);

	useEffect(() => {
		if (options && options.length > 0) {
			const categories = options.filter((item) => item.type === 'category');
			const subcategories = options.filter((item) => item.type === 'subcategory');
			const genders = options.filter((item) => item.type === 'gender');

			const changedProducts = genders.map((g) => ({
				Gender: g.value,
				category: categories.map((c) => ({
				title: c.value,
				subcategories: subcategories.filter((s) => s.categoryId === c.id).map((s) => s.value),
				})),
			}));

			setProductsOptions(changedProducts);
		}
	}, [options]);

	const getGenderCategories = (gender) =>
	productsOptions.find((p) => p.Gender === gender)?.category || [];

  return (
    <Fragment>
      <div className={`w-[100%] h-screen bg-[#64646435] sticky top-0 ${CMenu} z-10 font1`}>
        {transitions(
          (styles, item) =>
            item && (
				<animated.div style={styles}>
					<div
						className={`container absolute left-28 w-fit mx-auto h-[480px] ${CMenu} Mmenu bg-white`}
						onMouseEnter={() => parentCallback('block', true)}
						onMouseLeave={() => parentCallback('hidden', false)}
					>
						<div className="grid grid-cols-5 px-8 py-4 cursor-pointer">
							<div className="h-[418px] gap-5">
								<CategorySection
									title="Mens"
									categories={getGenderCategories('Men')}
									parentCallback={parentCallback}
								/>
							<hr className="py-1" />
								<CategorySection
									title="Women"
									categories={getGenderCategories('Women')}
									parentCallback={parentCallback}
							/>
							</div>
							<div className="h-[418px]">
								<CategorySection
									title="Kids"
									categories={getGenderCategories('Kids')}
									parentCallback={parentCallback}
								/>
							</div>
						</div>
					</div>
				</animated.div>
            )
        )}
      </div>
    </Fragment>
  );
};

// Reusable Category Section Component
const CategorySection = ({ title, categories, parentCallback }) => (
	<div>
		<h1 className="text-red-600 text-sm font-semibold py-1 mx-2">{title}</h1>
		{categories && categories.slice(0,5).map((category) => (
			<Link to="/products" key={category.title}>
				<li
					className="litext list-none py-0.5 m-2 hover:font-semibold"
					onClick={() => parentCallback('hidden', false)}
				>
					{category.title}
				</li>
			</Link>
		))}
	</div>
);

export default ProductsBar;
