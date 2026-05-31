import listingService from "../services/listingService.js";

// 리스팅 생성
export async function create(req, res, next) {
    try {
        const sellerUserId = Number(req.body?.sellerUserId);
        const data = await listingService.createListing(sellerUserId, {
            userCardId: req.body?.userCardId,
            quantity: req.body?.quantity,
            pricePerUnit: req.body?.pricePerUnit,
        });
        return res.status(201).json({ ok: true, data });
    } catch (err) {
        return next(err);
    }
}

// 리스팅 목록 조회
export async function list(req, res, next) {
    try {
        const limit = req.query?.limit;
        const cursor = req.query?.cursor;
        const sortBy = req.query?.sortBy || "reg_date";
        const sortOrder = req.query?.sortOrder || "DESC";
        const status = req.query?.status || "ACTIVE";

        const data = await listingService.listListings({
            limit,
            cursor,
            sortBy,
            sortOrder,
            status,
        });
        return res.json({ ok: true, data });
    } catch (err) {
        return next(err);
    }
}

// 리스팅 상세 조회
export async function get(req, res, next) {
    try {
        const id = Number(req.params?.id);
        const data = await listingService.getListingById(id);
        return res.json({ ok: true, data });
    } catch (err) {
        return next(err);
    }
}

// 리스팅 수정
export async function update(req, res, next) {
    try {
        const id = Number(req.params?.id);
        const sellerUserId = Number(req.body?.sellerUserId);

        const data = await listingService.updateListing(id, sellerUserId, {
            quantity: req.body?.quantity,
            pricePerUnit: req.body?.pricePerUnit,
        });
        return res.json({ ok: true, data });
    } catch (err) {
        return next(err);
    }
}

// 리스팅 취소
export async function cancel(req, res, next) {
    try {
        const id = Number(req.params?.id);
        const sellerUserId = Number(req.body?.sellerUserId);

        const data = await listingService.cancelListing(id, sellerUserId);
        return res.json({ ok: true, data });
    } catch (err) {
        return next(err);
    }
}
