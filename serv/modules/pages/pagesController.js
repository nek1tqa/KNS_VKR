import pool from "../../utils/database.js";

class PagesController {

    async getAll(req, res){

        try{

            const [result] = await pool.execute("SELECT * FROM `pages`");

            if(result.length){

                res.status(200).json(result);

            }else
                res.status(404).json();

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async getByFacultyId(req, res){

        const {id} = req.params;
        try{

            const [result] = await pool.query("SELECT * FROM `pages` WHERE faculty_id = ?", [id]);
            for(let pageData of result){

                const groupIdsArr = JSON.parse(pageData.group_ids)
                const groupIdsStr = groupIdsArr.join(", ");

                const query = `SELECT * FROM \`groups\` WHERE id IN (${groupIdsStr})`;
                const [groupsResult] = await pool.query(query);

                pageData.title = groupsResult.map(group => group['name']).join(", ");
                pageData.groups = groupsResult;

            }

            res.status(200).json(result);

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async getOne(req, res){

        try{

            const {id} = req.params;
            const [result] = await pool.execute("SELECT * FROM `pages` WHERE id = ?", [id]);

            if(result.length){

                res.status(200).json(result[0]);

            }else
                res.status(404).json();

        }catch(e){
            res.status(500).json({error: e.toString()});
        }

    }

    async create(req, res){

        let connection = null;
        const groupNames = [];
        try{

            const pageData = req.body;
            if(!pageData.length)
                return res.status(400).json({error: "Page data is incorrect"});

            for(let group of pageData) {

                if (group.name === undefined || group.name.toString().trim() === "")
                    return res.status(400).json({error: "Group name is incorrect"});
                if (group.subgroups_count === undefined || group.subgroups_count <= 1)
                    return res.status(400).json({error: "Subgroups count in group is incorrect"});
                if (group.faculties_id === undefined)
                    return res.status(400).json({error: "Faculty id in group is undefined"});

                // todo: faculties_id -> faculty_id
                const [groupResult] = pool.execute("SELECT * FROM `groups` WHERE LOWER(name) = LOWER(?) AND faculties_id = ?", [group.name, group.faculties_id]);
                if (groupResult.length || groupNames.includes(group.name.toLowerCase()))
                    return res.status(400).json({error: `Group ${group.name} is exist`});
                else
                    groupNames.push(group.name.toLowerCase());

            }

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();

            const groupIds = [];
            const groupQuery = "INSERT INTO `groups` (name, subgroups_count, faculties_id, semestr_id, type, width) VALUES (?, ?, ?, 1, 0, 80);"
            for(let group of pageData) {

                    const [groupResult] = await connection.execute(groupQuery, [group.name, group.subgroups_count, group.faculties_id]);
                    const groupId = groupResult.insertId;
                    groupIds.push(groupId);

            }

            const struct = '{"pageLessonNumbers": [[1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3], [1, 2, 3]], "unsavedCells": []}';
            const pageQuery = "INSERT INTO `pages` (semester_id, faculty_id, group_ids, struct) VALUES (1, ?, ?, ?)";

            // todo: facultyId in url ...pages/{faculty_id}
            const facultyId = pageData[0].faculties_id;
            const [pageResult] = await connection.execute(pageQuery, [facultyId, JSON.stringify(groupIds), struct]);
            const newItemId = pageResult.insertId;
            connection.commit();


            const [newItemResult] = await connection.execute("SELECT * FROM `pages` WHERE id = ?", [newItemId]);

            connection.release();

            res.status(200).json(newItemResult);

        }catch(e){
            if(connection){
                connection.rollback();
                connection.release();
            }
            res.status(500).json({error: e.toString()});
        }

    }

    async update(req, res){


    }

    async delete(req, res){

        let connection = null;
        try{

            const {id} = req.params;

            connection = await pool.getConnection();
            await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;");
            connection.beginTransaction();
            const [pageResult] = await connection.execute("SELECT * FROM `pages` WHERE id = ?", [id]);

            const groupIdsArr = JSON.parse(pageResult.group_ids)
            const groupIdsStr = groupIdsArr.join(", ");

            const [groupsDelResult] = await connection.execute(`DELETE FROM \`groups\` WHERE id IN (${groupIdsStr})`);
            const [pageDelResult] = await connection.execute("DELETE FROM `pages` WHERE id = ?", [id]);

            connection.commit();
            connection.release();

            if(pageDelResult.affectedRows)
                res.status(200).json();
            else
                res.status(404).json();

        }catch(e){
            if(connection){
                connection.rollback();
                connection.release();
            }
            res.status(500).json({error: e.toString()});
        }
    }

}

export default new PagesController();