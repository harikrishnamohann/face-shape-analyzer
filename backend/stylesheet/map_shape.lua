#! /usr/bin/env lua

-- usage: ./generate_json_for_db.lua [stylesheet|hairstyles]
-- or just ./generate_json_for_db.lua to generate both json files

-- to run this lua script,
-- install luarocks and install the following libraries first.
local mime = require "mime"   -- I didn't have to install this
local lfs = require "lfs"     -- sudo luarocks install luafilesystem
local json = require "dkjson" -- sudo luarocks install dkjson

local shapes = { "oval", "round", "oblong", "triangle", "square", "diamond", "heart" }

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
