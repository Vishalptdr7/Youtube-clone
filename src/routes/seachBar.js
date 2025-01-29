import { searchInSearchBar } from "../controllers/searchBar";

import { Router } from "express";

const router=Router();

router.route('/searching/:key').get(searchInSearchBar);