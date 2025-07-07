#! /usr/bin/env lua

-- usage: ./generate_json_for_db.lua [stylesheet|hairstyles]
-- or just ./generate_json_for_db.lua to generate both json files

-- to run this lua script,
-- install luarocks and install the following libraries first.
local mime = require "mime"   -- I didn't have to install this
local lfs = require "lfs"     -- sudo luarocks install luafilesystem
local json = require "dkjson" -- sudo luarocks install dkjson

local shapes = {
    OVAL = "oval",
    ROUND = "round",
    OBLONG = "oblong",
    TRIANGLE = "triangle",
    SQUARE = "square",
    DIAMOND = "diamond",
    HEART = "heart"
}

local operations = { insert = 1, delete = 2 }

-- returns a list of non-hidden items in a directory
local function list_directory(dir)
    local contents = {}
    for entity in lfs.dir(dir) do
        if not entity:match("^%.+$") then
            table.insert(contents, entity)
        end
    end
    return contents
end

-- this cli tool is used to manage shape_hairstyle_map.json file
-- it should be able to add and remove hairstyles to each shapes
-- ./map_shape remove oval crew_cut
-- ./map_shape <operation> <shape> <hairstyle>

local function usage()
    print("\nUSAGE: ./map_shape <operation> <shape> <hairstyle>")
    print("operation: { insert, delete }")
    print("shapes: {")
    for _, shape in pairs(shapes) do
        print("\t" .. shape)
    end
    print("}")
    os.exit(1)
end


local operation = operations[string.lower(arg[1])]
local shape = shapes[string.upper(arg[2])]
local hairstyle = arg[3]

if not operation or not shape or not hairstyle then
    io.write("ERR: ")
    if not operation then
        print("invalid operation: " .. operation)
    end
    if not shape then
        print(shape " is not a valid shape")
    end
    if not hairstyle then
        print("no hairstyle was specified")
    end
    usage()
end

local function insert_hairstyle()

end

local function delete_hairstyle()

end
